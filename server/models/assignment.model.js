const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pdf: { type: String, required: true }, // file URL or path
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // optional: teacher who created
  dueDate: { type: Date }, // optional: add a due date
  totalMarks: { type: Number, required: true } 
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
