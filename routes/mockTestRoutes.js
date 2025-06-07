const express = require('express');
const router = express.Router();
const {
  createTest,
  updateTest,
  deleteTest,
  getTestById,
  getAllTests,
  getMockTestsByInstituteId
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

module.exports = router;
