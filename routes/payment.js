const express = require("express");
const { isAuthenticatedUser } = require('../middleware/auth');
const { paymentProcess,sendStripeApiKey, confirmPay } = require("../controllers/payment");
const router = express.Router();

router.route("/payment").post(isAuthenticatedUser, paymentProcess);
router.route("/confirm").post(isAuthenticatedUser,confirmPay)
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
