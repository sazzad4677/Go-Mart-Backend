const User = require("../models/UserModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const sendToken = require("../utils/jwtToken")

// Register a user => api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { username, name, email, password } = req.body;
    const user = await User.create({
        username,
        name,
        email,
        password,
        avatar: {
            public_id: '',
            url: ''
        }
    })
    sendToken(user, 200, res)
})

// Login User => api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { username, email, password } = req.body
    if (((!email || username) && (email || !username)) || !password) {
        return next(new ErrorHandler("Please enter username or email & password", 400))
    }
    // Finding user in DB
    const user = await User.findOne({ $or: [{ email }, { username }] }).select('+password')
    if (!user) {
        return next(new ErrorHandler("Invalid email or username & password", 401))
    }
    // Checks if password is correct
    const isPasswordMatched = user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or username & password", 401))
    }

    if (user.status !== 'Active') {
        return next(new ErrorHandler(`your account is banned  ${"for " + user.banPeriod + " days" || user.status === 'Permanent Banned' && "permanently"} , contact with administrator`, 401))
    }

    sendToken(user, 200, res)
})

// Logout user => api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

// Get current login user profile=> api/v1/profile/:id
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({
        success: true,
        user
    })
})


// Update or change password => api/v1/password/update-password/:id
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id).select("+password")

    // Check previous password
    const isMatch = await user.comparePassword(req.body.oldPassword)
    if (!isMatch) {
        return next(new ErrorHandler("Old Password is incorrect",))
    }
    user.password = req.body.password
    await user.save()
    sendToken(user, 200, res)
})

// Update profile => api/v1/profile/update/:id
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
    }
    // Update profile picture: todo

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
    })
})
