const User = require("../models/user");

//sending and saving token in cookies
exports.sendToken = (user,status,res) => {
    const token = user.getJWTToken();
    const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure : true,
        sameSite: 'none',
        domain: 'main--frabjous-centaur-847b52.netlify.app'
      };
    res.status(status).cookie('token',token,options).json({
        user,
        token
    })
}