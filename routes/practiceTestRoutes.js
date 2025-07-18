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
router.get('/practice-test/by-institute/:instituteId', practiceTestController.getPracticeTestsByInstituteId);


// Update by ID
router.put('/update-practice-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.updatePracticeTest);


// Delete by ID
router.delete('/delete-practice-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher' ), practiceTestController.deletePracticeTest);


router.get('/practice-test/topic/:topicId', practiceTestController.getPracticeTestByTopic);


router.post('/practice-test/submit', practiceTestController.submitPracticeTestAnswers);


router.get('/practice-test/result/:resultId', practiceTestController.getPracticeTestResultById);


router.get('/practice-test-history/:studentId', practiceTestController.getPracticeTestHistoryByStudentId);


module.exports = router;
