const express = require('express');
const { getAllProducts, createProduct ,updateProduct, deleteProduct, getProduct, addReview, getReviews, deleteReview} = require('../controllers/product');
const { isAuthenticatedUser,authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/product/new-product').post(isAuthenticatedUser,authorizeRole("admin"),createProduct);
router.route('/product/:product_id')
.put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct)
.get(getProduct);

router.route('/review').post(isAuthenticatedUser,addReview).get(getReviews).delete(isAuthenticatedUser,deleteReview)

module.exports = router;