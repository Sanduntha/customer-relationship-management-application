const express = require('express');
const router = express.Router();
const { getLeads, getLead, createLead, updateLead, deleteLead, bulkUpdateStatus, exportLeadsCSV } = require('../controllers/leadController');
const { getNotes, addNote, deleteNote } = require('../controllers/noteController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Lead CRUD
router.get('/export/csv', exportLeadsCSV);
router.put('/bulk/status', bulkUpdateStatus);
router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// Lead Notes
router.get('/:id/notes', getNotes);
router.post('/:id/notes', addNote);
router.delete('/:id/notes/:noteId', deleteNote);

module.exports = router;
