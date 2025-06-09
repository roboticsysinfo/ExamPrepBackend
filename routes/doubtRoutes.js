const express = require('express');
const router = express.Router();
const {
  submitDoubt,
  getAllDoubts,
  getDoubtsByInstituteId,
  answerDoubt,
  getDoubtsByStudentId
} = require('../controllers/doubtsController');

// POST - Submit a doubt
router.post('/submit-doubt', submitDoubt);

// GET - All doubts
router.get('/all/doubts', getAllDoubts);

// GET - Doubts by institute ID
router.get('/doubts/by-institute/:instituteId', getDoubtsByInstituteId);

// PUT - Answer doubt
router.put('/answer/doubts/:doubtId', answerDoubt);

// GET - Doubts by student ID
router.get('/get/doubts/student/:studentId', getDoubtsByStudentId);

module.exports = router;
