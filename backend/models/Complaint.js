const mongoose = require('mongoose');

/**
 * Complaint Schema
 * - Tracks complaints submitted by students
 * - Priority is auto-assigned by the backend priority service (not user-set)
 * - Status flows: Pending → In Progress → Resolved (or Escalated after 48h)
 * - isEscalated flag allows easy querying of escalated complaints
 * - feedback allows students to provide comments after resolution
 */
const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Infrastructure',
        'Electrical',
        'Plumbing',
        'Internet',
        'Housekeeping',
        'Academic',
        'Other',
      ],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Escalated'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low',
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for efficient queries on status and priority
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ userId: 1 });
complaintSchema.index({ isEscalated: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
