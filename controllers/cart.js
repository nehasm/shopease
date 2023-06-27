const Cart = require('../models/cart');
const ErrorHandler = require('../utils/errorhandler');
const catchAsync =  require('../middleware/catchAsyncError');

// add new Order
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const productId = req.query.productId;
  const cartId = req.query.id;
  const { name, price,quantity,image,discount } = req.body;
  const cartItemObj = {
    name,
    price,
    quantity,
    image,
    product : productId,
    discount
  }
  const cart = await Cart.findById(cartId);
    cart.cartItems.push(cartItemObj);
    await cart.save({ validateBeforeSave: false })
    res.status(201).json({
      cart
    });
  });

  exports.removeItemFromCart = catchAsync(async (req, res, next) => {
    const cartId = req.query.cartId;
    const productId = req.query.productId;
    const cart = await Cart.findById(cartId);
    const updateCartItems =  cart.cartItems.filter(cartItem=> cartItem.product.toString() !== productId.toString())
      cart.cartItems = updateCartItems;
      await cart.save({ validateBeforeSave: false })
      res.status(201).json({
        cart
      });
    });

    exports.clearCart = catchAsync(async (req,res,next) => {
      const cartId = req.query.cartId;
      const cart = await Cart.findById(cartId);
      cart.cartItems = [];
      await cart.save({ validateBeforeSave: false })
      res.status(201).json({
        cart
      });
    })

    exports.updateCart = catchAsync(async (req, res, next) => {
      const productId = req.query.productId;
      const cartId = req.query.cartId;
      const { newQuantity } = req.body;
      const cart = await Cart.findById(cartId);
      const updateCartItems =  cart.cartItems.map(cartItem => {
        if(cartItem.product.toString() === productId.toString()){
          return { ...cartItem,quantity:newQuantity};
        }
        return cartItem;
      })
      cart.cartItems = updateCartItems;
        await cart.save({ validateBeforeSave: false })
        res.status(201).json({
          cart
        });
      });

  exports.getAllCartItems = catchAsync(async (req, res, next) => {
    return next(new ErrorHandler("Please login to get cart details"))
    const userId = req.user.id;
    if(userId.toString() === "") {
      return next(new ErrorHandler("Please login to get cart details"))
    }
    const cart = await Cart.find({user:userId});
    res.status(200).json({
      cart:cart[0]
    });
  })
