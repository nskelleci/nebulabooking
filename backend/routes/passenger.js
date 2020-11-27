const express = require("express");
const router = express.Router();
const {addPassenger, getPassenger} = require("../controllers/passengerController")

router.post("/add", addPassenger)

router.get("/getPassenger/:passportNo", getPassenger)


module.exports = router