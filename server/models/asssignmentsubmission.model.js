const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming 'User' is your student model
    required: true
  },
  pdf: {
    type: String,
    required: true
  },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },

  submittedAt: {
    type: Date,
    default: Date.now
  },
  marks: {
    type: Number, // optional
    default: null
  },
  status: {
    type: String,
    enum: ['submitted', 'graded'],
    default: 'submitted'
  }

}, { timestamps: true });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);

module.exports = AssignmentSubmission;
