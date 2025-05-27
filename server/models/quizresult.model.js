
const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true ,},
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      answer: { type: String, required: true },
    }
  ],
  score: { type: Number, required: true, default:-1 },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to ensure a student can submit a quiz only once
quizResultSchema.index({ quiz: 1, student: 1 }, { unique: true });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
module.exports = QuizResult;
