const mongoose = require('mongoose');

// models/Subject.js
const subjectSchema = new mongoose.Schema({

  name: { type: String, required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true }
  
});


module.exports = mongoose.model('Subject', subjectSchema);
