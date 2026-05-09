const { Op, fn, col, literal } = require('sequelize');
const { Lead } = require('../models');

const getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Lead.count();
        const newLeads = await Lead.count({ where: { status: 'New' } });
        const contactedLeads = await Lead.count({ where: { status: 'Contacted' } });
        const qualifiedLeads = await Lead.count({ where: { status: 'Qualified' } });
        const proposalSent = await Lead.count({ where: { status: 'Proposal Sent' } });
        const wonLeads = await Lead.count({ where: { status: 'Won' } });
        const lostLeads = await Lead.count({ where: { status: 'Lost' } });

        const totalEstimatedValue = await Lead.sum('estimated_deal_value') || 0;
        const wonDealsValue = await Lead.sum('estimated_deal_value', { where: { status: 'Won' } }) || 0;

        // Pipeline data for chart
        const pipelineData = [
            { name: 'New', value: newLeads, color: '#6366f1' },
            { name: 'Contacted', value: contactedLeads, color: '#8b5cf6' },
            { name: 'Qualified', value: qualifiedLeads, color: '#06b6d4' },
            { name: 'Proposal Sent', value: proposalSent, color: '#f59e0b' },
            { name: 'Won', value: wonLeads, color: '#10b981' },
            { name: 'Lost', value: lostLeads, color: '#ef4444' }
        ];

        // Lead source distribution
        const sourceData = await Lead.findAll({
            attributes: ['lead_source', [fn('COUNT', col('id')), 'count']],
            group: ['lead_source'],
            raw: true
        });

        // Conversion rate
        const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;

        // Upcoming follow-ups (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingFollowUps = await Lead.findAll({
            where: {
                next_follow_up: { [Op.between]: [today, nextWeek] },
                status: { [Op.notIn]: ['Won', 'Lost'] }
            },
            order: [['next_follow_up', 'ASC']],
            limit: 10
        });

        // Recent leads
        const recentLeads = await Lead.findAll({
            order: [['created_at', 'DESC']],
            limit: 5
        });

        // Salesperson performance
        const salespersonStats = await Lead.findAll({
            attributes: [
                'assigned_salesperson',
                [fn('COUNT', col('id')), 'total_leads'],
                [fn('SUM', literal("CASE WHEN status = 'Won' THEN 1 ELSE 0 END")), 'won_leads'],
                [fn('SUM', literal("CASE WHEN status = 'Won' THEN estimated_deal_value ELSE 0 END")), 'won_value']
            ],
            where: { assigned_salesperson: { [Op.ne]: null } },
            group: ['assigned_salesperson'],
            raw: true
        });

        res.json({
            success: true,
            data: {
                summary: {
                    totalLeads, newLeads, contactedLeads, qualifiedLeads,
                    proposalSent, wonLeads, lostLeads,
                    totalEstimatedValue: parseFloat(totalEstimatedValue),
                    wonDealsValue: parseFloat(wonDealsValue),
                    conversionRate: parseFloat(conversionRate)
                },
                pipelineData,
                sourceData,
                upcomingFollowUps,
                recentLeads,
                salespersonStats
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching dashboard stats.' });
    }
};

module.exports = { getDashboardStats };
