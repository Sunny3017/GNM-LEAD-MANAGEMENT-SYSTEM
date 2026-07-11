
const express = require('express');
const router = express.Router();
const { 
  createLead, 
  getLeads, 
  getLead, 
  updateLead, 
  deleteLead,
  addNote,
  getNotes
} = require('../controllers/leadController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(protect, authorize('admin'), createLead)
  .get(protect, authorize('admin', 'employee'), getLeads);

router.route('/:id')
  .get(protect, authorize('admin', 'employee'), getLead)
  .put(protect, authorize('admin', 'employee'), updateLead)
  .delete(protect, authorize('admin'), deleteLead);

router.route('/:id/notes')
  .post(protect, authorize('admin', 'employee'), addNote)
  .get(protect, authorize('admin', 'employee'), getNotes);

module.exports = router;
