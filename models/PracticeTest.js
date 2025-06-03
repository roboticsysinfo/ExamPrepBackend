const mongoose = require('mongoose');


const practiceTestSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Institute'
  },
  title: { type: String, required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },

  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  duration: { type: Number, default: 30 }, // minutes
  totalMarks: { type: Number },

  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 }, 

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});


module.exports = mongoose.model('PracticeTest', practiceTestSchema);
