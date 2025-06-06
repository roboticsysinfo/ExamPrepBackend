const mongoose = require('mongoose');

const practiceTestSubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeTest', required: true },
  score: Number,
  totalQuestions: Number,
  attempted: Number,
  correct: Number,
  wrong: Number,

  // ✅ Use ObjectId reference instead of string
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },

  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PracticeTestSubmission', practiceTestSubmissionSchema);
