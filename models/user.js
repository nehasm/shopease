const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Please enter your name"],
        maxLength:[35, "Name cannot exceed 35 characters"],
        minLength:[3,"Name must have more than 3 characters"]
    },
    email: {
        type: String,
        required : [ true, "Please enter your email"],
        unique: true,
        validate:[validator.isEmail,"Please enter a valid email address"]
    },
    password: {
        type: String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password must have more than 8 characters"],
        select:true
    },
    role : {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date,
    wishlist : [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          ratings: {
            type : Number,
            default : 0
          }
        
    }]
})

// password encryption
userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

//jwt token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
  };
  
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

// password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

module.exports = mongoose.model("User",userSchema);