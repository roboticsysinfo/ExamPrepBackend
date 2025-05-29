const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({

  title: { type: String, required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },         // optional
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },   // optional
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },       // optional

  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // selected questions
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  duration: { type: Number, default: 30 }, // in minutes
  totalMarks: { type: Number }

});


module.exports = mongoose.model('Test', testSchema);

