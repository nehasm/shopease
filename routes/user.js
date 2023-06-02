const express = require('express');
const { registerUser,loginUser,logoutUser,forgotPassword, resetPassword, changePassword,getUserdetails, updateUser,getAllUser, getUserById, updateUserRole, deleteUser, getWishlist, addItemToWishlist, deleteItemFromWishlist } = require('../controllers/user');
const { isAuthenticatedUser,authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/forgot/password').post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword);
router.route("/user").get(isAuthenticatedUser,getUserdetails);
router.route("/change/password").put(isAuthenticatedUser,changePassword);
router.route('/user/update').put(isAuthenticatedUser, updateUser);
router.route('/wishlist').get(isAuthenticatedUser,getWishlist).post(isAuthenticatedUser,addItemToWishlist).delete(isAuthenticatedUser,deleteItemFromWishlist);
//admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRole("admin"),getAllUser)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRole("admin"),getUserById).put(isAuthenticatedUser,authorizeRole("admin"),updateUserRole).delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser)
module.exports = router;
