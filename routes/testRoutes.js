const express = require('express');
const router = express.Router();
const {
  createTest,
  updateTest,
  deleteTest,
  getTestById,
  getAllTests
} = require('../controllers/testController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');


// Routes for Test
router.post('/create-test', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher'), createTest);         // Create test

router.put('/update-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher'), updateTest);       // Update test

router.delete('/delete-test/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), deleteTest);    // Delete test

router.get('/single-test/:id',  getTestById);      // Get test by ID

router.get('/tests', getAllTests);         // Get all tests

module.exports = router;
