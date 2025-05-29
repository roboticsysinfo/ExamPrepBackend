const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
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
  village: { type: String, },
  profileImage: {
    type: String,
    default: 'https://dummyimage.com/150x150/cccccc/000000&text=Profile'
  },
  role: {
    type: String,
    default: 'student'
  },
}, { timestamps: true });


module.exports = mongoose.model('Student', studentSchema);
