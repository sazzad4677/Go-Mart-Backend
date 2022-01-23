const jwt = require("jsonwebtoken")
const User = require("../models/UserModel")
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('./catchAsyncErrors')

// checks if user is authenticated
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler('You are not authenticated', 401));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decode.id)
    next()
})

// handling user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler('You are not allowed to access this resource', 403))
        }
        next()
    }
}