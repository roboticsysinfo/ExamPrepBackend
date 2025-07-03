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

// =================== REGISTER STUDENT ===================
exports.registerStudent = async (req, res) => {
  try {
    const {
      instituteId,
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

    if (!instituteId) {
      return res.status(400).json({
        success: false,
        message: 'Institute ID is required',
      });
    }

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
      profileImage = req.file.path;
    }

    const registrationNumber = await generateRegNumber();

    const student = await Student.create({
      instituteId,
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

// =================== SEND OTP (Dummy) ===================
exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    const existingUser = await Student.findOne({ phoneNumber });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not found. Try with another Phone Number',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // otp,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// =================== VERIFY OTP (Dummy 123456) ===================
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

    const token = jwt.sign(
      { id: student._id, role: 'student' },
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

// =================== UPDATE STUDENT ===================
exports.updateStudent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
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




// =================== GET STUDENT BY ID ===================
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

// =================== DELETE STUDENT ===================
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

// =================== GET ALL STUDENTS ===================
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

// =================== GET STUDENTS BY INSTITUTE ID ===================
exports.getStudentsByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    if (!instituteId) {
      return res.status(400).json({
        success: false,
        message: 'Institute ID is required',
      });
    }

    const students = await Student.find({ instituteId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
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


exports.getLeaderboardData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // Current page
    const limit = parseInt(req.query.limit) || 20; // Items per page
    const skip = (page - 1) * limit;

    // Total students count
    const totalStudents = await Student.countDocuments();

    // Paginated & sorted students
    const students = await Student.find({}, 'name profileImage overallScore')
      .sort({ overallScore: -1 })  // Descending by score
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: 'Leaderboard fetched successfully',
      data: {
        students,
        pagination: {
          total: totalStudents,
          page,
          limit,
          totalPages: Math.ceil(totalStudents / limit),
          hasNextPage: page * limit < totalStudents,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};

// get studnet overall score and rank

exports.getStudentOverallRank = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // ✅ Get all students sorted by overallScore descending
    const allStudents = await Student.find({}, 'name profileImage overallScore mockTestScore practiceTestScore')
      .sort({ overallScore: -1 });

    // ✅ Find rank
    const rank = allStudents.findIndex(student => student._id.toString() === studentId) + 1;

    if (rank === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in leaderboard'
      });
    }

    const student = allStudents[rank - 1];

    return res.status(200).json({
      success: true,
      message: 'Student overall rank fetched successfully',
      data: {
        studentId,
        name: student.name,
        profileImage: student.profileImage,
        mockTestScore: student.mockTestScore || 0,
        practiceTestScore: student.practiceTestScore || 0,
        overallScore: student.overallScore || 0,
        rank
      }
    });

  } catch (error) {
    console.error('Error fetching student rank:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching rank'
    });
  }
};
