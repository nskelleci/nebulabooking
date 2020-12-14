const express = require("express");
const router = express.Router();

const {getCruiseListwithOccupancy} = require("../controllers/dashboardController")


router.get("/cruiseList", getCruiseListwithOccupancy)




module.exports = router