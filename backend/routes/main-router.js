const express = require('express');
const router = express.Router();

const agency = require('./agency');
const auth = require('./auth');
const vessel = require('./vessel')
const port = require('./port')
const country = require('./country')
const cruiseType = require('./cruise-type')
const cruise = require('./cruise')
const agencyType = require('./agency-type')
const cabinCategorie = require("./cabin-categories")
const bedType = require("./bed-type")
const cabin = require("./cabin")
const price = require("./price")
const passenger = require("./passenger")
const season = require("./season")
const market = require("./market")
const booking = require("./bookings")
const logout = require("./logout")
const blockedCabins = require("./blockedCabin")
const adminDashboard = require("./admin-dashboard")
//  /api
const {getAccessToRoute} = require("../middlewares/authorization/auth");

router.use("/adminDashboard", adminDashboard)
router.use("/agency",getAccessToRoute, agency);
router.use("/auth", auth);
router.use("/vessel",getAccessToRoute,vessel)
router.use("/port", port)
router.use("/country",getAccessToRoute, country)
router.use("/cruiseType",getAccessToRoute, cruiseType)
router.use("/cruise",cruise)
router.use("/blockedCabin", blockedCabins)
router.use("/agencytype",getAccessToRoute, agencyType)
router.use("/cabinCategories",getAccessToRoute, cabinCategorie)
router.use("/bedtype",getAccessToRoute,bedType)
router.use("/cabin", cabin)
router.use("/price", price)
router.use("/passenger",getAccessToRoute,passenger)
router.use("/season",getAccessToRoute, season)
router.use("/market", getAccessToRoute,market)
router.use("/booking",booking)
router.use("/logout",logout)

module.exports = router;