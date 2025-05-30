const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({

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
