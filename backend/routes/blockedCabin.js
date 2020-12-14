const express = require("express");
const router = express.Router();

const {addBlockedCabin, getAllblockedCabins,getAllBlockedCabinsByCruise, updateBlockedCabin} = require("../controllers/blockedCabinController")

router.get("/getAll",getAllblockedCabins)
router.post("/add", addBlockedCabin)
router.put("/update/:id", updateBlockedCabin)
router.get("/cruise/:cruiseId/", getAllBlockedCabinsByCruise)


module.exports = router