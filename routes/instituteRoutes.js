// routes/instituteRoutes.js
const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/instituteController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');


router.post('/register-institute', authenticateUser, authorizeRoles('super-admin'), instituteController.createInstitute);

router.get('/get/institutes', authenticateUser, authorizeRoles('super-admin'), instituteController.getAllInstitutes);

router.get('/institute/:id', authenticateUser, authorizeRoles('super-admin'), instituteController.getInstituteById);

router.put('/institute/:id', authenticateUser, authorizeRoles('super-admin'), instituteController.updateInstitute);

router.delete('/institute/:id', authenticateUser, authorizeRoles('super-admin'), instituteController.deleteInstitute);


module.exports = router;
