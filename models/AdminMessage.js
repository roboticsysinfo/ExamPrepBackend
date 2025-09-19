const mongoose = require('mongoose');

const adminMessageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  sentToAll: { type: Boolean, default: true }, // Send to all students
  sentToIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Optional specific students
}, { timestamps: true });

module.exports = mongoose.model('AdminMessage', adminMessageSchema);
