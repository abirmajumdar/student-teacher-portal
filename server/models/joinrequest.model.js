import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

joinRequestSchema.index({ student: 1, batch: 1 }, { unique: true });

export default mongoose.model('JoinRequest', joinRequestSchema);
