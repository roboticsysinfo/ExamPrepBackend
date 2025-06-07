// models/MockTestResult.js
const mongoose = require('mongoose');

const practiceTestResultSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeTest', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  totalQuestions: Number,
  attempted: Number,
  correct: Number,
  wrong: Number,
  score: Number,
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedOption: String,
      correctOption: String,
      isCorrect: Boolean
    }
  ],
  submittedAt: { type: Date, default: Date.now },
  timeTaken: Number // in seconds
});

module.exports = mongoose.model('PracticeTestResult', practiceTestResultSchema);
