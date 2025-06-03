const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');


// Create new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, instituteId } = req.body;

        // 🔐 CASE 1: No logged-in user (initial super-admin creation)
        if (!req.user) {
            if (role !== 'super-admin') {
                return res.status(403).json({
                    success: false,
                    message: "Only 'super-admin' can be created without login",
                });
            }

            // Continue to create super-admin
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                instituteId: null,  // super-admin doesn't need this
                createdBy: null
            });

            await user.save();
            return res.status(201).json({ success: true, user });
        }

        // 🔐 CASE 2: Authenticated user exists
        const currentUserRole = req.user.role;

        if (
            (currentUserRole === 'super-admin' && role !== 'admin') ||
            (currentUserRole === 'admin' && role !== 'teacher') ||
            (currentUserRole !== 'super-admin' && currentUserRole !== 'admin')
        ) {
            return res.status(403).json({
                success: false,
                message: `You are not allowed to create a user with role '${role}'`,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
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



// Login User
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
                role: user.role,
                instituteId: user.instituteId,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get single user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Update user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, instituteId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, instituteId },
            { new: true }
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Delete user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



// Assign Role
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
