const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true,'Please enter the name'],
        trim: true
    },
    description : {
        type: String,
        required : [true,'Please enter the description'] 
    },
    price : {
        type: Number,
        required : [true,'Please enter the price'],
        maxLength:8
    },
    ratings : {
        type : Number,
        default : 0
    },
    images : [
        {
            public_id : {
                type: String,
                required: [true,'Please enter the public id']
            },
            url : {
                type: String,
                required: [true,'Please enter the image url']
            }
        }
    ],
    category : {
        type: String,
        required : [true,'Please enter the category']
    },
    stock : {
        type : Number,
        default : 1,
        required : [true,'Please enter the stock'],
        maxLength: 5
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    brandName : {
        type:String
    },
    discount : {
        type:Number,
        default:0
    },
    reviews : [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
              },
            name : {
                type: String,
                required : true,
            },
            rating : {
                type : Number,
                default : 0
            },
            comment : {
                type : String,
                required : true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdBy : {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('Product',productSchema);