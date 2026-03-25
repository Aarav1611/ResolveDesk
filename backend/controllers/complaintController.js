const Complaint = require('../models/Complaint');
const { detectPriority } = require('../services/priorityService');

/**
 * @desc    Create a new complaint (Student only)
 * @route   POST /api/complaints
 * @access  Private (Student)
 *
 * Priority is auto-detected from the title + description.
 * Students cannot manually set priority.
 */
const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Auto-detect priority based on keywords in title/description
    const priority = detectPriority(title, description);

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get complaints
 *          - Students: see only their own complaints
 *          - Admins: see all complaints with optional filters
 * @route   GET /api/complaints
 * @access  Private
 *
 * Query params (admin only):
 *   status   - filter by status (Pending, In Progress, Resolved, Escalated)
 *   priority - filter by priority (High, Medium, Low)
 *   escalated - filter escalated only (true)
 */
const getComplaints = async (req, res) => {
  try {
    let query = {};

    // Students can only see their own complaints
    if (req.user.role === 'student') {
      query.userId = req.user._id;
    }

    // Apply optional filters from query parameters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    if (req.query.escalated === 'true') {
      query.isEscalated = true;
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get a single complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'userId',
      'name email'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Students can only view their own complaints
    if (
      req.user.role === 'student' &&
      complaint.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update complaint status (Admin only)
 * @route   PUT /api/complaints/:id/status
 * @access  Private (Admin)
 */
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Escalated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        // If resolved, mark as not escalated; if escalated, mark flag
        isEscalated: status === 'Escalated',
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Add feedback to a complaint (Student only — their own complaint)
 * @route   PUT /api/complaints/:id/feedback
 * @access  Private (Student)
 */
const addFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Ensure student owns this complaint
    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add feedback to this complaint',
      });
    }

    complaint.feedback = feedback;
    await complaint.save();

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete a complaint (Admin only)
 * @route   DELETE /api/complaints/:id
 * @access  Private (Admin)
 */
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get dashboard statistics (Admin only)
 * @route   GET /api/complaints/stats
 * @access  Private (Admin)
 *
 * Returns aggregated counts used by the Admin Dashboard:
 *   - Total complaints
 *   - Count per status (Pending, In Progress, Resolved, Escalated)
 *   - Count per priority (High, Medium, Low)
 */
const getStats = async (req, res) => {
  try {
    const [total, statusStats, priorityStats, escalatedCount] =
      await Promise.all([
        Complaint.countDocuments(),
        Complaint.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Complaint.aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]),
        Complaint.countDocuments({ isEscalated: true }),
      ]);

    // Transform aggregation results into a cleaner object
    const byStatus = {};
    statusStats.forEach((s) => (byStatus[s._id] = s.count));

    const byPriority = {};
    priorityStats.forEach((p) => (byPriority[p._id] = p.count));

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: {
          Pending: byStatus['Pending'] || 0,
          'In Progress': byStatus['In Progress'] || 0,
          Resolved: byStatus['Resolved'] || 0,
          Escalated: byStatus['Escalated'] || 0,
        },
        byPriority: {
          High: byPriority['High'] || 0,
          Medium: byPriority['Medium'] || 0,
          Low: byPriority['Low'] || 0,
        },
        escalated: escalatedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  addFeedback,
  deleteComplaint,
  getStats,
};
