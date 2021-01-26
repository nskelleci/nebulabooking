const PaymentRequest = require("../services/payment-request-service")
const asyncErrorWrapper = require("express-async-handler");

const createPaymentRequest = asyncErrorWrapper( async (req,res,next)=>{   
    const paymentRequest =  await PaymentRequest.add(req.body);

    if(!paymentRequest) return next(new CustomError("Payment Request Couldn't add",400));

    res.json({
        success : true,
        message : "Payment Request added succesfully",
        data : paymentRequest
    })   

})


const updatePaymentRequest = asyncErrorWrapper( async (req,res,next)=>{   
    const paymentRequest =  await PaymentRequest.update(req.params.id, req.body);

    if(!paymentRequest) return next(new CustomError("Payment Request Couldn't update",400));

    res.json({
        success : true,
        message : "Payment Request updated succesfully",
        data : paymentRequest
    })   

})

const getAllPaymentRequest = asyncErrorWrapper( async (req,res,next)=>{   

    const options = {
        filter : null,
        populate : ["booking"]
    }

    const getAllpaymentRequest =  await PaymentRequest.findAll(options);

    if(!getAllpaymentRequest) return next(new CustomError("Get All Payment Request Couldn't update",400));

    res.json({
        success : true,
        message : "Get All Payment Request list succesfully",
        data : getAllpaymentRequest
    })   

})

module.exports = {createPaymentRequest, updatePaymentRequest,getAllPaymentRequest};