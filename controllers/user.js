const User = require("../models/user");
const Cart = require('../models/cart')
const ErrorHandler = require('../utils/errorhandler');
const catchAsync =  require('../middleware/catchAsyncError');
const { sendToken } = require('../utils/utilities');
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const user = require("../models/user");

exports.registerUser = catchAsync(async (req,res,next) => {
    const {name,email,password} = req.body;
    const user = await User.create({name,email,password});
    const cart = await Cart.create({user:user._id})
    sendToken(user,201,res);
})

exports.loginUser = catchAsync( async (req,res,next) => {
    const {email,password } = req.body;
    if ( !email || !password) {
        return next(new ErrorHandler('Please enter the required details',400));
    }
    const  user =  await User.findOne({email}).select("+password")
    const isPasswordMatched = !user ? false :user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email address or password",401))
    }
    sendToken(user,200,res);
})

exports.logoutUser = catchAsync(async(req,res,next) => {
  const options = {
    httpOnly: true,
    secure : true,
    sameSite: 'none',
    domain: 'shoppease.netlify.app'
  };
  // to avoid cookie cache on browser
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.clearCookie('token', options).status(200).json({
    message: 'Logout successfully!'
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;
    
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
      await sendEmail({
        email: user.email,
        subject: `Emall Password Recovery`,
        message,
      });
  
      res.status(200).json({
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // reset password
  exports.resetPassword = catchAsync(async (req, res, next) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

exports.getUserdetails = catchAsync(async(req,res,next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    user
  })
})

exports.changePassword = catchAsync(async(req,res,next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
      return next(new ErrorHandler("Old password is not matched!",400))
  }
  if(req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not matched!",400))
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user,200,res);
})

exports.updateUser = catchAsync(async(req,res,next) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    user
  });
})
// get users (only admin)
exports.getAllUser = catchAsync(async(req,res,next) => {
  const users = await User.find();
  res.status(200).json({
    users
  });
})

// get user (only admin)
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`,400)
    );
  }
  res.status(200).json({
    user,
  });
});

// update user (only admin)
exports.updateUserRole = catchAsync(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    user
  });
});

// delete user (only admin)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  await user.deleteOne();
  res.status(200).json({
    message: "User Deleted Successfully",
  });
});


exports.addItemToWishlist = catchAsync(async (req,res,next) => {
  const { name, price,ratings,image, product } = req.body;
  const userId = req.user._id;

  const wishListItem = {
    product,
    name,
    price,
    image,
    ratings
  };
  const user = await User.findById(userId);
  const ifProductAlreadyPresent = user.wishlist.find(item=>item.product.toString() === product.toString());
  if(ifProductAlreadyPresent) {
    return next(new ErrorHandler("Product already present in wishlist"),409);
  }
  user.wishlist.push(wishListItem);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
      user
  });
})

exports.getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  res.status(200).json({
    wishlist: user.wishlist,
  });
});


exports.deleteItemFromWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const wishlist = user.wishlist.filter(
    (rev) => rev.product.toString() !== req.query.productId.toString()
  );

  const updateUser  = await User.findByIdAndUpdate(
    req.user._id,
    {
      wishlist,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    user:updateUser
  });
});