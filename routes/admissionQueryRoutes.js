const express = require('express');
const router = express.Router();
const {
  sendAdmissionQuery,
  getAdmissionQueries,
  getAdmissionQueriesByInstituteId
} = require('../controllers/admissionQueryController');
const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');


// @route   POST /api/admission-queries
router.post('/send-admission-query', sendAdmissionQuery);


// @route   GET /api/admission-queries
// router.get('/get-admission-query', authenticateUser, authorizeRoles('super-admin'), getAdmissionQueries);

// New route to get queries by institute ID
router.get(
  '/getAdmissionQueriesByInstituteId/:instituteId',
  authenticateUser,
  authorizeRoles('super-admin', 'admin', 'teacher'),
  getAdmissionQueriesByInstituteId
);

module.exports = router;
