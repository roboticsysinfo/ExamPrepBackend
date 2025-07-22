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

  // 🔽 Updated to support multiple topics
  topic: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],

  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  duration: { type: Number, default: 30 },
  totalMarks: { type: Number },

  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 }
});

module.exports = mongoose.model('MockTest', mockTestSchema);
