const express = require('express');
const router = express.Router();
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
  getAllQuestions,
  bulkCreateQuestions,
  getQuestionsByFilter,
  getQuestionsByInstituteId,
} = require('../controllers/questionController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');


// Question Routes
router.post('/create-question', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher'), createQuestion);         // Create question

router.post('/create-bulk-questions', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher'), bulkCreateQuestions); 

router.put('/update-question/:id', authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher'), updateQuestion);       // Update question

router.delete('/delete-question/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), deleteQuestion);    // Delete question

router.get('/single-question/:id',  getQuestionById);      // Get question by ID

router.get('/all/questions', getAllQuestions);         // Get all questions

router.get('/questions/filter', getQuestionsByFilter);

// question by institute id
router.get('/questions/institute/:instituteId', getQuestionsByInstituteId);

module.exports = router;
