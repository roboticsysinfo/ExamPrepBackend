const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  loginUser,
  getUsersByInstituteId,
  loginWithOtp,
  verifyOtp
} = require('../controllers/userController');

const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Create new user - Only super-admin or admin can create

router.post('/create-user', authenticateUser, authorizeRoles('super-admin', 'admin'), createUser);


router.post('/login', loginUser);

router.post('/teacher/login-otp', loginWithOtp);

router.post('/teacher/verify-otp', verifyOtp);


// Get all users - Only super-admin or admin can view
router.get('/users', authenticateUser, authorizeRoles('super-admin', 'admin'), getAllUsers);


//  Get user by ID - All authenticated users
router.get('/getUserById/:id', authenticateUser, getUserById);


// Update user - Only super-admin or the same user can update
router.put('/user-update/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), updateUser);


// Delete user - Only super-admin
router.delete('/user-delete/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), deleteUser);


// Assign role - Only super-admin
router.put('/user/assign-role/:id', authenticateUser, authorizeRoles('super-admin'), assignRole);


router.get('/users/by-institute/:instituteId', getUsersByInstituteId);

module.exports = router;
