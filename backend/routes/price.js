const express = require("express");
const router = express.Router();
const { addPrice, getPrices, updatePrice, deletePrice, calculateFrontEndPrice, calculateBackEndPrice, calculateBackEndPriceObject } = require("../controllers/priceController")

router.post("/add", addPrice)

router.get("/vessel/:vessel/cruiseType/:cruiseType/market/:market/season/:season", getPrices)

router.put("/updatePrice/:price", updatePrice)

router.delete("/delete/:price", deletePrice)

router.post("/calculatefrontend", calculateFrontEndPrice)

router.post("/calculatebackend", calculateBackEndPrice)

router.post("/calculatebackendsingle", calculateBackEndPriceObject)

module.exports = router