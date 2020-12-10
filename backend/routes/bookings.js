const express = require("express");
const router = express.Router();

const {createBooking, updateBooking, getAllbookingsbyagency, getBooking} = require("../controllers/bookingController")


router.get("/mybookings/", getAllbookingsbyagency)
router.post("/createBooking/", createBooking)
router.put("/updateBooking/:booking", updateBooking)
router.get("/getBooking/:booking", getBooking)


module.exports = router