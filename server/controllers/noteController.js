const { LeadNote, LeadActivity, Lead } = require('../models');

const getNotes = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });

        const notes = await LeadNote.findAll({
            where: { lead_id: req.params.id },
            order: [['created_at', 'DESC']]
        });
        res.json({ success: true, data: notes });
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching notes.' });
    }
};

const addNote = async (req, res) => {
    try {
        const { note_content } = req.body;
        if (!note_content || note_content.trim() === '') {
            return res.status(400).json({ success: false, message: 'Note content is required.' });
        }
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });

        const note = await LeadNote.create({
            lead_id: req.params.id,
            note_content: note_content.trim(),
            created_by: req.user.name
        });

        await LeadActivity.create({
            lead_id: req.params.id,
            activity_type: 'note_added',
            description: `Note added: "${note_content.substring(0, 80)}..."`,
            performed_by: req.user.name
        });

        res.status(201).json({ success: true, message: 'Note added successfully.', data: note });
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({ success: false, message: 'Server error while adding note.' });
    }
};

const deleteNote = async (req, res) => {
    try {
        const note = await LeadNote.findOne({
            where: { id: req.params.noteId, lead_id: req.params.id }
        });
        if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });

        await note.destroy();
        res.json({ success: true, message: 'Note deleted successfully.' });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting note.' });
    }
};

module.exports = { getNotes, addNote, deleteNote };
