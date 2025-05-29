const Student = require('../models/StudentModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mock_secret';


// Generate unique 10 digit number
const generateRegNumber = async () => {
  let regNumber;
  let exists = true;

  while (exists) {
    const random = Math.floor(1000000000 + Math.random() * 9000000000); // 10 digit
    regNumber = `REG-${random}`;
    exists = await Student.findOne({ registrationNumber: regNumber });
  }

  return regNumber;
};


// Register student
exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      address,
      state,
      city,
      village,
      fatherName,
      motherName,
      dob,
      gender
    } = req.body;

    // Check if student already exists
    const existing = await Student.findOne({ phoneNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered',
      });
    }

    // If image is uploaded
    let profileImage = 'https://dummyimage.com/150x150/cccccc/000000&text=Profile';
    if (req.file) {
      profileImage = req.file.path; // If stored locally
    }

    // genereate student unique registration number

    const registrationNumber = await generateRegNumber();

    // Create student
    const student = await Student.create({
      registrationNumber,
      name,
      phoneNumber,
      email,
      address,
      state,
      city,
      village,
      fatherName,
      motherName,
      dob,
      gender,
      profileImage
    });

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// Login with phone number and dummy OTP // Dummy OTP sending (for development)

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    // Save or cache OTP here in future with expiry (e.g. Redis, DB)

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      //   otp: '123456' // show only in dev
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};


// OTP verify
exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (otp !== '123456') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    const student = await Student.findOne({ phoneNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: 'student' }, // payload
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      data: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// Update student by ID (with optional image upload)
exports.updateStudent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If image is uploaded
    if (req.file) {
      updateData.profileImage = req.file.path; // local image path
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};



// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student fetched successfully',
      data: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};


// Delete student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};


// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'All students fetched successfully',
      data: students,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};