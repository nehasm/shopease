const catchAsync =  require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = catchAsync(async (req,res,next) => {
    const { token } = req.cookies;
    if(!token) {
        return next(new ErrorHandler("Please login to access this resource",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET)
    //we are saving user data in request
    req.user = await User.findById(decodedData.id);

    next();
})

exports.authorizeRole = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} role is not allowed to access this request`,403));
        }
    next();
    }
}
