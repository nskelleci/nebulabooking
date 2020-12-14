const express = require("express");
const router = express.Router();
const {addCruise,getCruisesbyCruiseType, updateCruise, getCruises,cruiseDetail} = require("../controllers/cruiseController")

router.post("/add", addCruise)
router.get("/GetAll", getCruises)
router.put("/updatecruise/:id", updateCruise)
router.get("/detail/:id", cruiseDetail)
router.get("/getCruisesbyCruiseType/:cruiseType", getCruisesbyCruiseType)


module.exports = router

