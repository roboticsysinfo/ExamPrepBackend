const express = require('express');
const router = express.Router();
const {
  createSubject,
  updateSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectById,
  getSubjectsByInstituteId,
  getSubjectsByExamId
} = require('../controllers/subjectController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');


// Create subject
router.post('/create-subject', authenticateUser, authorizeRoles('super-admin', 'admin', "teacher"), createSubject);


// update or edit subject
router.put('/update/subject/:id', authenticateUser, authorizeRoles('super-admin', 'admin', "teacher"), updateSubject);


// delete subject
router.delete('/delete/subject/:id', authenticateUser, authorizeRoles('super-admin', 'admin', ), deleteSubject);


// get all subjects
router.get('/subjects', authenticateUser, authorizeRoles('super-admin', 'admin', ), getAllSubjects);


// get single subject by subject id
router.get('/getsubjectbyid/:id', authenticateUser, authorizeRoles('super-admin', 'admin', ), getSubjectById);


// get all subjects
router.get('/subjects/by-institute/:instituteId', authenticateUser, authorizeRoles('super-admin', 'admin', ), getSubjectsByInstituteId);


router.get('/subjects/by-exam/:examId', getSubjectsByExamId);



module.exports = router;
