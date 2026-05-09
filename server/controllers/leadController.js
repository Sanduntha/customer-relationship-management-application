const { Op } = require('sequelize');
const { Lead, LeadNote, LeadActivity, User } = require('../models');

// Fetch all leads with support for filtering, search, and pagination
const getLeads = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            lead_source,
            assigned_salesperson,
            priority,
            search,
            sort_by = 'created_at',
            sort_order = 'DESC'
        } = req.query;

        // Build where clause
        const where = {};

        if (status) {
            where.status = status;
        }

        if (lead_source) {
            where.lead_source = lead_source;
        }

        if (assigned_salesperson) {
            where.assigned_salesperson = assigned_salesperson;
        }

        if (priority) {
            where.priority = priority;
        }

        // Search across lead name, company name, and email
        if (search) {
            where[Op.or] = [
                { lead_name: { [Op.like]: `%${search}%` } },
                { company_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Validate sort fields
        const allowedSortFields = ['created_at', 'updated_at', 'lead_name', 'company_name', 'estimated_deal_value', 'status', 'lead_score'];
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
        const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { count, rows: leads } = await Lead.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [[sortField, sortDirection]],
            limit: parseInt(limit),
            offset
        });

        res.json({
            success: true,
            data: {
                leads,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching leads.'
        });
    }
};

// Get details for a specific lead, including their notes and activity history
const getLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: LeadNote,
                    as: 'notes',
                    order: [['created_at', 'DESC']]
                },
                {
                    model: LeadActivity,
                    as: 'activities',
                    order: [['created_at', 'DESC']]
                }
            ]
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found.'
            });
        }

        res.json({
            success: true,
            data: lead
        });
    } catch (error) {
        console.error('Get lead error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching lead.'
        });
    }
};

// Create a new lead record and log the initial activity
const createLead = async (req, res) => {
    try {
        const {
            lead_name,
            company_name,
            email,
            phone,
            lead_source,
            assigned_salesperson,
            status,
            estimated_deal_value,
            priority,
            lead_score,
            next_follow_up,
            description
        } = req.body;

        // Validate required fields
        if (!lead_name || !company_name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Lead name, company name, and email are required.'
            });
        }

        const lead = await Lead.create({
            lead_name,
            company_name,
            email,
            phone,
            lead_source: lead_source || 'Website',
            assigned_salesperson,
            status: status || 'New',
            estimated_deal_value: estimated_deal_value || 0,
            priority: priority || 'Medium',
            lead_score: lead_score || 0,
            next_follow_up,
            description,
            created_by: req.user.id
        });

        // Log activity
        await LeadActivity.create({
            lead_id: lead.id,
            activity_type: 'created',
            description: `Lead "${lead_name}" created`,
            performed_by: req.user.name
        });

        // Fetch lead with associations
        const fullLead = await Lead.findByPk(lead.id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Lead created successfully.',
            data: fullLead
        });
    } catch (error) {
        console.error('Create lead error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while creating lead.'
        });
    }
};

/**
 * Update a lead
 * PUT /api/leads/:id
 */
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found.'
            });
        }

        const oldStatus = lead.status;
        const oldValues = { ...lead.dataValues };

        // Update lead fields
        const updatableFields = [
            'lead_name', 'company_name', 'email', 'phone',
            'lead_source', 'assigned_salesperson', 'status',
            'estimated_deal_value', 'priority', 'lead_score',
            'next_follow_up', 'description'
        ];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                lead[field] = req.body[field];
            }
        });

        await lead.save();

        // Log status change activity
        if (req.body.status && req.body.status !== oldStatus) {
            await LeadActivity.create({
                lead_id: lead.id,
                activity_type: 'status_changed',
                description: `Status changed from "${oldStatus}" to "${req.body.status}"`,
                performed_by: req.user.name,
                old_value: oldStatus,
                new_value: req.body.status
            });
        }

        // Log general update activity
        if (!req.body.status || req.body.status === oldStatus) {
            // Find what changed
            const changes = [];
            updatableFields.forEach(field => {
                if (req.body[field] !== undefined && String(req.body[field]) !== String(oldValues[field])) {
                    changes.push(field.replace(/_/g, ' '));
                }
            });

            if (changes.length > 0) {
                await LeadActivity.create({
                    lead_id: lead.id,
                    activity_type: 'updated',
                    description: `Updated: ${changes.join(', ')}`,
                    performed_by: req.user.name
                });
            }
        }

        // Fetch updated lead with associations
        const updatedLead = await Lead.findByPk(lead.id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: LeadNote, as: 'notes', order: [['created_at', 'DESC']] },
                { model: LeadActivity, as: 'activities', order: [['created_at', 'DESC']] }
            ]
        });

        res.json({
            success: true,
            message: 'Lead updated successfully.',
            data: updatedLead
        });
    } catch (error) {
        console.error('Update lead error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors.map(e => e.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while updating lead.'
        });
    }
};

/**
 * Delete a lead
 * DELETE /api/leads/:id
 */
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found.'
            });
        }

        await lead.destroy();

        res.json({
            success: true,
            message: 'Lead deleted successfully.'
        });
    } catch (error) {
        console.error('Delete lead error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting lead.'
        });
    }
};

/**
 * Bulk update lead status
 * PUT /api/leads/bulk/status
 */
const bulkUpdateStatus = async (req, res) => {
    try {
        const { lead_ids, status } = req.body;

        if (!lead_ids || !Array.isArray(lead_ids) || lead_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lead IDs array is required.'
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required.'
            });
        }

        // Get old statuses for activity logging
        const leads = await Lead.findAll({
            where: { id: { [Op.in]: lead_ids } }
        });

        // Update all leads
        await Lead.update(
            { status },
            { where: { id: { [Op.in]: lead_ids } } }
        );

        // Log activities
        for (const lead of leads) {
            if (lead.status !== status) {
                await LeadActivity.create({
                    lead_id: lead.id,
                    activity_type: 'status_changed',
                    description: `Bulk status update: "${lead.status}" to "${status}"`,
                    performed_by: req.user.name,
                    old_value: lead.status,
                    new_value: status
                });
            }
        }

        res.json({
            success: true,
            message: `${lead_ids.length} leads updated successfully.`
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during bulk update.'
        });
    }
};

/**
 * Export leads to CSV
 * GET /api/leads/export/csv
 */
const exportLeadsCSV = async (req, res) => {
    try {
        const { status, lead_source, assigned_salesperson } = req.query;

        const where = {};
        if (status) where.status = status;
        if (lead_source) where.lead_source = lead_source;
        if (assigned_salesperson) where.assigned_salesperson = assigned_salesperson;

        const leads = await Lead.findAll({
            where,
            order: [['created_at', 'DESC']]
        });

        // Build CSV
        const headers = [
            'ID', 'Lead Name', 'Company', 'Email', 'Phone',
            'Lead Source', 'Assigned To', 'Status', 'Deal Value',
            'Priority', 'Lead Score', 'Next Follow-up', 'Created Date'
        ];

        let csv = headers.join(',') + '\n';

        leads.forEach(lead => {
            const row = [
                lead.id,
                `"${lead.lead_name}"`,
                `"${lead.company_name}"`,
                lead.email,
                lead.phone || '',
                lead.lead_source,
                `"${lead.assigned_salesperson || ''}"`,
                lead.status,
                lead.estimated_deal_value,
                lead.priority,
                lead.lead_score,
                lead.next_follow_up || '',
                lead.created_at
            ];
            csv += row.join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during export.'
        });
    }
};

module.exports = {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    bulkUpdateStatus,
    exportLeadsCSV
};
