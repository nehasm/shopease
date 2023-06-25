const Product = require('../models/product');
const ErrorHandler = require('../utils/errorhandler');
const catchAsync =  require('../middleware/catchAsyncError');
const QueryHandler = require('../utils/queryhandler');
const { query } = require('express');

//only admin
exports.createProduct = catchAsync(async (req,res,next) => {
    req.body.user = req.user.id;
        const product = await Product.create(req.body);
        res.status(201).json({
            product
        })
})

//only admin
exports.updateProduct = catchAsync(async (req,res,next) => {
    let id = req.params.product_id;
    let product = Product.findById(id);
    if(!product) {
        return next(new ErrorHandler('Product not found',404))
    }
    product = await Product.findByIdAndUpdate(id,req.body,{
        new: true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        product
    })
});

//only admin
exports.deleteProduct = catchAsync(async (req,res,next) => {
    const id = req.params.product_id;
    const product = await Product.findById(id);
    if(!product) {
        return next(new ErrorHandler('Product not found',404))
    }
    await product.deleteOne()
    res.status(200).json({
        message: "Product deleted successfully!"
    })
});

exports.getProduct = catchAsync(async (req,res,next) => {
    const product = await Product.findById(req.params.product_id);
    if(!product) {
        return next(new ErrorHandler('Product not found',404))
    }
    res.status(200).json({
        product
    })
});


exports.getAllProducts = catchAsync(async (req,res) => {
    const itemPerPage = 5;
    let totalProductCountAfterFilter;
    //change api method to add query acceptance functionaliyu in it
    const totalProductCount = await Product.countDocuments();
    const apiQueries = new QueryHandler(Product.find(),req.query)
                        .search()
                        .filter()
    let products = await apiQueries.query.clone();
    totalProductCountAfterFilter = products.length;
    apiQueries.pagination(itemPerPage);
    products = await apiQueries.query;
    res.status(200).json({
      products,
        totalProductCount,
        itemPerPage,
        totalProductCountAfterFilter
    })
});

exports.addReview = catchAsync(async (req,res,next) => {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
        message:"Review added sucessfully!"
    });
})

exports.getReviews = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      reviews: product.reviews,
    });
  });


  exports.deleteReview = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      message:"Review deleted sucessfully!"
    });
  });