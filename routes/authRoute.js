const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, getUserProfile, updatePassword, updateProfile} = require('../controllers/authController');

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/profile/:id').get(getUserProfile)
router.route('/update/password/:id').put(updatePassword)
router.route('/update/profile/:id').put(updateProfile)

module.exports = router;