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
  res.status(200).json({ stripeApiKey: "pk_test_51NEs84SAmuwdiphh0b0O3I3smVKg1Ig7nL3Ga7rXlV0w1nftd733vTRR4KaLfmrc8qBDv4NPcUGbcBiocgdwn7nI00PebNAape" });
});

exports.confirmPay = catchAsync(async(req,res,next)=> {
    console.log(req.body)
    const result = await stripe.confirmCardPayment(req.body.client_secret, req.body.paydata);
    res.status(200).json({result})
})