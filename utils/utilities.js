const User = require("../models/user");

//sending and saving token in cookies
exports.sendToken = (user,status,res) => {
    const token = user.getJWTToken();
    const options = {
        expires: new Date(
          Date.now() + 1 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure : true,
        sameSite: 'none',
        domain: 'shoppease.netlify.app'
      };
    res.status(status).cookie('token',token,options).json({
        user,
        token
    })
} 