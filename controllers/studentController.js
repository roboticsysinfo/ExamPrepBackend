const OTPModel = require('../models/OTPModel');
const Student = require('../models/StudentModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mock_secret';
const axios = require("axios")


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
        message: "Institute ID is required",
      });
    }

    // Check if student already exists
    const existing = await Student.findOne({ phoneNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // ✅ Declare variable safely
    let profileImage = null;
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
      ...(profileImage && { profileImage }), // ✅ only add if exists
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
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


// ========= Fast 2 sms ========

// Reviewer phone numbers (fixed OTP)
const reviewNumbers = ["1122334455", "9876543210"];

// 📲 SEND OTP
// exports.sendOtp = async (req, res) => {
//   try {
//     const { phoneNumber } = req.body;
//     if (!phoneNumber) return res.status(400).json({ message: "Phone number is required" });

//     const student = await Student.findOne({ phoneNumber });
//     if (!student) return res.status(404).json({ message: "Phone number not registered" });

//     let otp;
//     if (reviewNumbers.includes(phoneNumber)) {
//       otp = "123456"; // fixed OTP for reviewers
//     } else {
//       otp = Math.floor(100000 + Math.random() * 900000).toString();

//       // ✅ Send OTP via Fast2SMS
//       await axios.post(
//         "https://www.fast2sms.com/dev/bulkV2",
//         {
//           route: "dlt",
//           sender_id: "QUOTEV",       // replace with your approved sender ID
//           message: "198140",          // replace with your approved DLT template ID
//           variables_values: otp,
//           numbers: phoneNumber,
//         },
//         {
//           headers: {
//             authorization: process.env.FAST2SMS_API_KEY,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     // Save OTP with 1-minute expiry
//     const expiresAt = new Date(Date.now() + 60 * 1000);
//     await OTPModel.create({ phone: phoneNumber, otp, expiresAt });

//     res.status(200).json({
//       success: true,
//       message: reviewNumbers.includes(phoneNumber)
//         ? "Review mode: OTP fixed to 123456"
//         : "OTP sent successfully via SMS",
//     });
//   } catch (err) {
//     console.error("Send OTP Error:", err.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// ✅ VERIFY OTP
// exports.verifyOtp = async (req, res) => {
//   try {
//     const { phoneNumber, otp } = req.body;
//     if (!phoneNumber || !otp)
//       return res.status(400).json({ message: "Phone number and OTP are required" });

//     const latestOtp = await OTPModel.findOne({ phone: phoneNumber }).sort({ createdAt: -1 });
//     if (!latestOtp || latestOtp.otp !== otp || new Date(latestOtp.expiresAt) < new Date()) {
//       return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     await OTPModel.deleteMany({ phone: phoneNumber }); // OTP consumed

//     const student = await Student.findOne({ phoneNumber });
//     if (!student) return res.status(404).json({ success: false, message: "Student not found" });

//     const token = jwt.sign({ id: student._id, role: "student" }, JWT_SECRET, { expiresIn: "7d" });

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       data: {
//         _id: student._id,
//         name: student.name,
//         email: student.email,
//         phoneNumber: student.phoneNumber,
//       },
//     });
//   } catch (err) {
//     console.error("Verify OTP Error:", err.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// ============ Fast 2 sms ===========







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




// ✅ Update FCM Token
exports.updateStudentFcmToken = async (req, res) => {
  try {
    const { studentId, fcmToken } = req.body;

    if (!studentId || !fcmToken) {
      return res.status(400).json({ message: "studentId & fcmToken required" });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { fcmToken },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "FCM Token updated successfully", student });
  } catch (error) {
    console.error("FCM update error:", error);
    res.status(500).json({ message: "Server error" });
  }
}


// ✅ Remove FCM Token (logout / token expire)
exports.removeFcmToken = async (req, res) => {
  try {

    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "studentId required" });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $unset: { fcmToken: "" } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "FCM Token removed successfully", student });
  } catch (error) {
    console.error("Remove FCM error:", error);
    res.status(500).json({ message: "Server error" });
  }
  
}