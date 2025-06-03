const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
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
  duration: { type: Number, default: 30 }, // in minutes
  totalMarks: { type: Number },

  // 🔽 new fields
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 } // applicable only if isPaid is true
});

module.exports = mongoose.model('MockTest', mockTestSchema);
