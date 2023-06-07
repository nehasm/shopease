const ErrorHandler = require('../utils/errorhandler');
const catchAsync =  require('../middleware/catchAsyncError');
const stripe = require("stripe")("sk_test_51NEs84SAmuwdiphhPRH7jd7lKB70qcsYzhLo9eq2375skZmyZN8b1vzA5juo86vG0p96AVrXxPUEgTfLJAgtxU5G0031asq2hD");

exports.paymentProcess = catchAsync(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "StopEase",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsync(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

exports.confirmPay = catchAsync(async(req,res,next)=> {
    console.log(req.body)
    const result = await stripe.confirmCardPayment(req.body.client_secret, req.body.paydata);
    res.status(200).json({result})
})