const express = require('express');
const router = express.Router();
const {
  sendAdmissionQuery,
  getAdmissionQueries,
  getAdmissionQueriesByInstituteId,
  deleteAdmissionQuery
} = require('../controllers/admissionQueryController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploads');

// @route   POST /api/admission-queries
router.post('/send-admission-query', upload.single('profileImage'), sendAdmissionQuery);

// @route   GET /api/admission-queries
// router.get('/get-admission-query', authenticateUser, authorizeRoles('super-admin'), getAdmissionQueries);


// New route to get queries by institute ID
router.get(
  '/getAdmissionQueriesByInstituteId/:instituteId',
  authenticateUser,
  authorizeRoles('super-admin', 'admin', 'teacher'),
  getAdmissionQueriesByInstituteId
);


router.delete('/delete/admission-queries/:id', deleteAdmissionQuery);


module.exports = router;
