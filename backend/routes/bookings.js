const express = require("express");
const router = express.Router();

const {createBooking, updateBooking, getAllbookingsbyagency, getBooking, getBookingCruiseId, bookingToday} = require("../controllers/bookingController")


router.get("/mybookings/", getAllbookingsbyagency)
router.post("/createBooking/", createBooking)
router.put("/updateBooking/:booking", updateBooking)
router.get("/getBooking/:booking", getBooking)
router.get("/getBookingsByCruise/:id", getBookingCruiseId)
router.get("/getBookingsToday/", bookingToday)


module.exports = router