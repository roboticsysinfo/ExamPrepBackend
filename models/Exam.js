const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Institute'
  },
  name: { type: String, required: true },
  examCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamCategory',
    required: true
  },
  description: String,
  examImage: {
    type: String,
    default: "https://placehold.co/600x400/png"
  }

});

module.exports = mongoose.model('Exam', examSchema);
