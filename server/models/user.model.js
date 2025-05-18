const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true, // optional: helps clean input
    lowercase: true, // optional: normalizes email
  },
  verificationCode: {
    type: String,
  },
  joinedBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }]
},{ timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
