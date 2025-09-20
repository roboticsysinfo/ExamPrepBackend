const express = require('express');
const router = express.Router();
const adminMessageController = require('../controllers/adminMessageController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// CRUD routes
router.post('/create-message',  adminMessageController.createMessage);


router.get('/get-admin-messages', adminMessageController.getAllMessages);


router.get('/admin/single-message:id', authenticateUser, authorizeRoles('super-admin', 'admin'), adminMessageController.getMessageById);


router.put('/update-message/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), adminMessageController.updateMessage);


router.delete('/delete-message/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), adminMessageController.deleteMessage);


module.exports = router;
