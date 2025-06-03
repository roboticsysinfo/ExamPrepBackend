const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Institute'
  },

  questionText: { type: String, required: true },

  options: [{ type: String, required: true }],

  correctAnswerIndex: { type: Number, required: true },

  explanation: String,

  marks: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
});

module.exports = mongoose.model('Question', questionSchema);
