const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  addFeedback,
  deleteComplaint,
  getStats,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

// All complaint routes require authentication
router.use(protect);

// Stats route MUST come before /:id to avoid "stats" being parsed as an ID
router.get('/stats', authorize('admin'), getStats);

// CRUD routes
router.route('/').get(getComplaints).post(authorize('student'), createComplaint);

router.route('/:id').get(getComplaint).delete(authorize('admin'), deleteComplaint);

// Status update (admin only)
router.put('/:id/status', authorize('admin'), updateComplaintStatus);

// Feedback (student only)
router.put('/:id/feedback', authorize('student'), addFeedback);

module.exports = router;
