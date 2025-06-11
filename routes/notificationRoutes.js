const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// 🔹 Send to one student
router.post('/send-notification', notificationController.sendNotification);

// 🔹 Send to all students of institute
router.post('/send-notification-to-all', notificationController.sendNotificationToAll);

// 🔹 Get notifications by user and institute
router.get('/notifications/user/:userId/institute/:instituteId', notificationController.getNotificationsByUser);

// 🔹 Mark all as read
router.put('/read-all/user/:userId/institute/:instituteId', notificationController.markAllAsRead);

// 🔹 Mark one as read
router.put('/read-one/:notificationId', notificationController.markOneAsRead);


// Get all notifications by institute (without userId)
router.get('/notifications/by-institute/:instituteId', notificationController.getNotificationsByInstitute);

module.exports = router;
