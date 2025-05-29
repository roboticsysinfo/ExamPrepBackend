const express = require('express');
const router = express.Router();
const {
    createExam,
    updateExam,
    deleteExam,
    getExamById,
    getAllExams
} = require('../controllers/examController');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const upload = require("../middlewares/uploads")


// Routes

// 🔹 Create Exam
router.post('/create-exam',  upload.single('examImage'), authenticateUser, authorizeRoles('super-admin', 'admin', "teacher"), createExam); // POST /api/exams


// 🔹 Update Exam
router.put('/update-exam/:id',  upload.single('examImage'), authenticateUser, authorizeRoles('super-admin', 'admin', "teacher"), updateExam);  // PUT /api/exams/:id


// 🔹 Delete Exam
router.delete('/delete-exam/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), deleteExam); // DELETE /api/exams/:id


// 🔹 Get Single Exam by ID
router.get('/single-exam/:id', getExamById); // GET /api/exams/:id


// 🔹 Get All Exams
router.get('/get/exams', getAllExams); // GET /api/exams


module.exports = router;
