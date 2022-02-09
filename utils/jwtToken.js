// Create and send token and save in cookie
const sendToken = (user, statusCode, res, remember = false) => {
    // Create jwt token
    const token = user.getJwtToken()
    // options for cookie
    const options = {
        expires:
            remember
                ? new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME_NO_REMEMBER_TIME * 60 * 1000),
        httpOnly: true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken;