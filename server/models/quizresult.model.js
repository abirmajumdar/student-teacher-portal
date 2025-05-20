// // models/quizResult.model.js
// const mongoose = require('mongoose');

// const quizResultSchema = new mongoose.Schema({
//   quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
//   student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // assuming you have a User model
//   answers: [
//     {
//       questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
//       answer: { type: String, required: true },
//     }
//   ],
//   score: { type: Number, required: true },
//   total: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const QuizResult = mongoose.model('QuizResult', quizResultSchema);
// module.exports = QuizResult;
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
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to ensure a student can submit a quiz only once
quizResultSchema.index({ quiz: 1, student: 1 }, { unique: true });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
module.exports = QuizResult;
