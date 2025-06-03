const express = require('express');
const router = express.Router();
const practiceTestController = require('../controllers/practiceTestController');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { authenticateUser } = require('../middlewares/authMiddleWare');


// Create
router.post('/create-practice-test', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.createPracticeTest);

// Get practice-tests
router.get('/all/practice-tests/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.getAllPracticeTests);


// Get by ID
router.get('/get/practiceTestById/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.getPracticeTestById);


// Get all by Institute ID
router.get('/practice-test/by-institute/:instituteId', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.getPracticeTestsByInstituteId);


// Update by ID
router.put('/update-practice-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.updatePracticeTest);


// Delete by ID
router.delete('/delete-practice-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.deletePracticeTest);


module.exports = router;
