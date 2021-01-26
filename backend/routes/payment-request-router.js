const express = require("express");
const router = express.Router();

const {getAllPaymentRequest,createPaymentRequest,updatePaymentRequest} = require("../controllers/paymentRequestController")

router.get("/", getAllPaymentRequest)
router.post("/", createPaymentRequest)
router.put("/:id", updatePaymentRequest)


module.exports = router