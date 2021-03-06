const ErrorHandler = require('../utils/errorHandler');

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
        // Wrong mongoose object id error
        if (err.name === 'CastError') {
            const message = `Resource Not Found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 400)
        }
        // Handle mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            const message = `${Object.keys(err.keyValue)} is already exist`
            error = new ErrorHandler(message, 400)
        }

        // Wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = "Json web token is invalid. try again"
            error = new ErrorHandler(message, 400)
        }

        // Expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = "Json web token is Expired. try again"
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server error"
        })
    }
}