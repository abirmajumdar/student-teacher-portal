const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // helps avoid duplicate teacher emails
    lowercase: true, // normalizes email for consistency
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: { // fixed typo: isvarified → isVerified
    type: Boolean,
    default: false
  },
  // expertise: String,
  createdBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }]
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
