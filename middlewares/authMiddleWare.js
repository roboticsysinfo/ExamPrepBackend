const jwt = require('jsonwebtoken');
const Student = require('../models/StudentModel');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Common Auth Middleware
exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded._id);
    } else if (decoded.role === 'admin') {
      user = await User.findById(decoded._id);
    } else if (decoded.role === 'teacher') {
      user = await User.findById(decoded._id);
    } else if (decoded.role === 'super-admin') {
      user = await User.findById(decoded._id);
    }


    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
