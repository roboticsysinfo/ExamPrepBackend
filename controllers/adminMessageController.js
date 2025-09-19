const AdminMessage = require('../models/AdminMessage');
const Student = require('../models/StudentModel');
const { sendPushNotification } = require('../utils/fcm');

exports.createMessage = async (req, res) => {
    try {
        const { title, body } = req.body;

        // Save message to DB
        const message = new AdminMessage({ title, body });
        await message.save();

        // Get all students with FCM token
        const students = await Student.find({ fcmToken: { $exists: true, $ne: null } });

        // Send push notifications
        students.forEach(student => {
            sendPushNotification(student.fcmToken, title, body);
        });

        res.status(201).json({ success: true, message: 'Message saved and notification sent.', data: message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};




exports.getAllMessages = async (req, res) => {
    try {
        const messages = await AdminMessage.find().sort({ createdAt: -1 });
        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getMessageById = async (req, res) => {
    try {
        const message = await AdminMessage.findById(req.params.id);
        if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
        res.json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { title, body } = req.body;
        const message = await AdminMessage.findByIdAndUpdate(
            req.params.id,
            { title, body },
            { new: true }
        );
        if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
        res.json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const message = await AdminMessage.findByIdAndDelete(req.params.id);
        if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
