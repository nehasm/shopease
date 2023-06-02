const ErrorHandler = require('../utils/errorhandler');

module.exports = (err,req,res,next) => {
    if(err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message,404);
    }
    err.statusCode = err.statusCode ? err.statusCode : 500;  

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        error: {
            statusCode : err.statusCode || 500,
            message: err.message || "Internal Server Error!"
        }
    })
}