const Notification = require('../models/Notification');
const Student = require('../models/StudentModel');

// ✅ Send notification to one student
exports.sendNotification = async (req, res) => {
    try {

        const { userId, instituteId, type, title, message } = req.body;

        const notification = await Notification.create({
            userId,
            instituteId,
            type,
            title,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Notification sent successfully',
            data: notification
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending notification', error: error.message });
    }

};


// ✅ Send bulk notification to all students of an institute
exports.sendNotificationToAll = async (req, res) => {
    try {
        const { instituteId, type, title, message } = req.body;

        const students = await Student.find({ instituteId });
        const notifications = [];

        for (let student of students) {
            notifications.push({
                userId: student._id,
                instituteId,
                type,
                title,
                message
            });
        }

        await Notification.insertMany(notifications);

        res.status(201).json({
            success: true,
            message: `Notification sent to ${students.length} students successfully`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending notifications', error: error.message });
    }
};

// ✅ Get notifications for a student in a specific institute
// ✅ Get notifications for a student in a specific institute (with unread count)
exports.getNotificationsByUser = async (req, res) => {
    try {
        const { userId, instituteId } = req.params;

        // Get all notifications
        const notifications = await Notification.find({ userId, instituteId })
            .sort({ createdAt: -1 });

        // Get unread count
        const unreadCount = await Notification.countDocuments({
            userId,
            instituteId,
            isRead: false
        });

        res.status(200).json({
            success: true,
            message: 'Notifications fetched successfully',
            data: {
                notifications,
                unreadCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};




// ✅ Mark all notifications as read for a student in an institute
exports.markAllAsRead = async (req, res) => {
    try {
        const { userId, instituteId } = req.params;

        await Notification.updateMany({ userId, instituteId, isRead: false }, { isRead: true });

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating notifications', error: error.message });
    }
};

// ✅ Mark one notification as read
exports.markOneAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error marking as read', error: error.message });
    }
};
