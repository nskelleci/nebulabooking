const express = require("express");
const router = express.Router();

const {addBlockedCabin, getAllblockedCabins,getAllBlockedCabinsByCruise, updateBlockedCabin, getBlockedCabin} = require("../controllers/blockedCabinController")

router.get("/getAll",getAllblockedCabins)
router.post("/add", addBlockedCabin)
router.put("/update", updateBlockedCabin)
router.get("/cruise/:cruiseId/", getAllBlockedCabinsByCruise)
router.post("/cabin/", getBlockedCabin)

module.exports = router