const express = require('express');
const { addItemToCart,getAllCartItems,updateCart,removeItemFromCart, clearCart } = require('../controllers/cart')
const { isAuthenticatedUser,authorizeRole } = require('../middleware/auth');

const router = express.Router();
router.route('/cart').post(isAuthenticatedUser ,addItemToCart).get(isAuthenticatedUser,getAllCartItems).put(isAuthenticatedUser,updateCart).delete(isAuthenticatedUser,removeItemFromCart);
router.route('/cart/clear').delete(isAuthenticatedUser,clearCart);

module.exports = router;