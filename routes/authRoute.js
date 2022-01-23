const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, getUserProfile, updatePassword, updateProfile, forgotPassword, resetPassword} = require('../controllers/authController');

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/profile/:id').get(getUserProfile)
router.route('/update/password/:id').put(updatePassword)
router.route('/update/profile/:id').put(updateProfile)
router.route('/password/forgot-password').post(forgotPassword)
router.route('/password/reset-password/:token').put(resetPassword)

module.exports = router;