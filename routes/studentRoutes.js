const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploads');


// student registration
router.post('/student/register', upload.single('profileImage'), authenticateUser, authorizeRoles('super-admin', 'admin', "teacher"), studentController.registerStudent);


// send otp for student login app
router.post('/student/login/send-otp', studentController.sendOtp);


// verify otp for student login app
router.post('/student/verify-otp', studentController.verifyOtp);


// update student info
router.put('/update/student/:id', upload.single('profileImage'), authenticateUser, authorizeRoles('super-admin', 'admin', "teacher"), studentController.updateStudent);


// delete student 
router.delete('/delete/student/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), studentController.deleteStudent);


router.get('/students', authenticateUser, authorizeRoles('super-admin'), studentController.getAllStudents);


// get single student info
router.get('/getstudentbyid/:id', studentController.getStudentById);


router.get('/get-students-by-institute/:instituteId',authenticateUser, authorizeRoles('super-admin', 'admin', 'teacher') , studentController.getStudentsByInstituteId);



router.get('/get-leaderboard-data',  studentController.getLeaderboardData);


router.get('/overall-score-rank/:studentId', studentController.getStudentOverallRank);

module.exports = router;
