const express = require('express');
const router = express.Router();
const {
  createTest,
  updateTest,
  deleteTest,
  getTestById,
  getAllTests,
  getMockTestsByInstituteId,
  searchMockTests,
  filterMockTests,
  submitMockTestAnswers,
  getMockTestResultById,
  getMockTestHistoryByStudentId
} = require('../controllers/mockTestController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');


// Routes for Test
router.post('/create-test', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher'), createTest);         // Create test

router.put('/update-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher'), updateTest);       // Update test

router.delete('/delete-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), deleteTest);    // Delete test

router.get('/single-test/:id',  getTestById);      // Get test by ID

router.get('/tests', getAllTests);         // Get all tests


router.get('/mock-tests/by-institute/:instituteId', getMockTestsByInstituteId);


router.get('/mock-test/search', searchMockTests);


router.get('/mock-tests/filter', filterMockTests);


router.post('/mock-test/submit', submitMockTestAnswers);


router.get('/mock-test/result/:resultId', getMockTestResultById);

// get student's mock test history
router.get('/mock-test-history/:studentId', getMockTestHistoryByStudentId);


module.exports = router;
