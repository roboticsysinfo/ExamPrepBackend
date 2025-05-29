const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({

  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  name: { type: String, required: true }
  
});

module.exports = mongoose.model('Topic', topicSchema);
