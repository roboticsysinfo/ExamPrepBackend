const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Institute'
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: true
  },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  address: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  village: { type: String },
  profileImage: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  role: {
    type: String,
    default: 'student'
  },

  // ✅ New Score Fields
  mockTestScore: {
    type: Number,
    default: 0
  },
  practiceTestScore: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
