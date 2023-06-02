const express = require('express');
const { addItemToCart,getAllCartItems,updateCart,removeItemFromCart } = require('../controllers/cart')
const { isAuthenticatedUser,authorizeRole } = require('../middleware/auth');

const router = express.Router();
router.route('/cart').post(isAuthenticatedUser ,addItemToCart).get(isAuthenticatedUser,getAllCartItems).put(isAuthenticatedUser,updateCart).delete(isAuthenticatedUser,removeItemFromCart)

module.exports = router;