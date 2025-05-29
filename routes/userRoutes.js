const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  loginUser
} = require('../controllers/userController');

const { authenticateUser } = require('../middlewares/authMiddleWare');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Create new user - Only super-admin or admin can create

router.post('/create-user', createUser);


router.post('/login', loginUser);


// Get all users - Only super-admin or admin can view
router.get('/users', authenticateUser, authorizeRoles('super-admin', 'admin'), getAllUsers);

//  Get user by ID - All authenticated users
router.get('/:id', authenticateUser, getUserById);

// Update user - Only super-admin or the same user can update
router.put('/:id', authenticateUser, authorizeRoles('super-admin', 'admin'), updateUser);

// Delete user - Only super-admin
router.delete('/:id', authenticateUser, authorizeRoles('super-admin'), deleteUser);

// Assign role - Only super-admin
router.put('/:id/assign-role', authenticateUser, authorizeRoles('super-admin'), assignRole);

module.exports = router;
