const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Institute'
  },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  name: { type: String, required: true },

  topicDetail: {
    type: String,
  }
  
});

module.exports = mongoose.model('Topic', topicSchema);
