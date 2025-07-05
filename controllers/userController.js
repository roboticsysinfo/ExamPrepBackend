const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, instituteId, phoneNumber } = req.body;

        if (!email || !password || !phoneNumber) {
            return res.status(400).json({ success: false, message: 'Email, password, and phone number are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) return res.status(400).json({ message: 'Phone number already in use' });

        if (!req.user) {
            if (role !== 'super-admin') {
                return res.status(403).json({
                    success: false,
                    message: "Only 'super-admin' can be created without login",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                role,
                instituteId: null,
                createdBy: null
            });

            await user.save();
            return res.status(201).json({ success: true, user });
        }

        const currentUserRole = req.user.role;

        if (
            (currentUserRole === 'super-admin' && role !== 'admin') ||
            (currentUserRole === 'admin' && role !== 'teacher') ||
            (currentUserRole === 'admin' && role !== 'admin') ||
            (currentUserRole !== 'super-admin' && currentUserRole !== 'admin')
        ) {
            return res.status(403).json({
                success: false,
                message: `You are not allowed to create a user with role '${role}'`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            instituteId,
            createdBy: req.user._id,
        });

        await user.save();
        res.status(201).json({ success: true, user });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Login User with email/password
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' });

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                instituteId: user.instituteId,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ OTP Login - Step 1
exports.loginWithOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        const user = await User.findOne({ phoneNumber, role: 'teacher' });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Teacher with this phone number not found' });
        }

        // Simulate sending OTP
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully (mock)',
            mockOtp: '123456', // 🔐 For testing only
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ OTP Verify - Step 2
exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
        }

        const user = await User.findOne({ phoneNumber, role: 'teacher' });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Teacher with this phone number not found' });
        }

        if (otp !== '123456') {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                instituteId: user.instituteId,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Other CRUD functions
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, instituteId, phoneNumber } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, instituteId, phoneNumber },
            { new: true }
        );

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.assignRole = async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ['super-admin', 'admin', 'teacher'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUsersByInstituteId = async (req, res) => {
    try {
        const { instituteId } = req.params;

        const users = await User.find({ instituteId }).select('-password');

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
