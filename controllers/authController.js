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