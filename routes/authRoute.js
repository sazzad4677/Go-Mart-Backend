const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, getAllUsers, getUsersDetails,deleteUser, updateUserProfileByAdmin } = require('../controllers/authController');

const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout/').get(logout)
router.route('/password/forgot-password').post(forgotPassword)
router.route('/password/reset-password/:token').put(resetPassword)
router.route('/profile').get(isAuthenticated, getUserProfile)
router.route('/update/password').put(isAuthenticated, updatePassword)
router.route('/update/profile').put(isAuthenticated, updateProfile)
// Authorized routes
router.route('/admin/users').get(isAuthenticated, authorizeRoles('admin'), getAllUsers)
router.route('/admin/user/').get(isAuthenticated, authorizeRoles('admin'), getUsersDetails)
router.route('/admin/user/delete/').delete(isAuthenticated, authorizeRoles('admin'), deleteUser)
router.route('/admin/user/update/').put(isAuthenticated, authorizeRoles('admin'), updateUserProfileByAdmin)


module.exports = router;