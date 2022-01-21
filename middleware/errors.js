const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // if no error then 500 will be default error code
    err.message = err.message || "Internal Server error";
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }
        error.message = err.message
        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server error"
        })
    }
}