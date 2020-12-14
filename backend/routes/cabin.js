const express = require("express");
const router = express.Router();

const {addCabin,getAllCabins, getAllCabinsbyVessel,getAvailableCabinsBycabinCategory, getAllAvailableCabins, updateCabin} = require("../controllers/cabinController")

router.get("/getAll", getAllCabins)
router.get("/vessel/:vessel", getAllCabinsbyVessel)
router.post("/add", addCabin)
router.put("/update/:id", updateCabin)
router.get("/cruise/:cruise/", getAllAvailableCabins)
router.get("/cruise/:cruise/cabinCategory/:cabinCategory", getAvailableCabinsBycabinCategory)



module.exports = router