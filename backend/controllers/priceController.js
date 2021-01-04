const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const CalculatePrice = require("../Helpers/price/CalculatePriceClass");
const priceService = require("../services/price-service");
const price = require("../models/price")
var moment = require("moment");
const { Promise } = require("mongoose");

const addPrice = asyncErrorWrapper(async (req, res, next) => {

    const price = req.body
    const addedPrice = await priceService.add(price);

    if (!addedPrice) return next(new CustomError("Price Couldn't add", 400));

    res.json({
        success: true,
        message: "Price added succesfully",
        data: addedPrice
    })

});

const getPrices = asyncErrorWrapper(async (req, res, next) => {

    const params = {
        vessel: req.params.vessel,
        cruiseType: req.params.cruiseType,
        market: req.params.market,
        season: req.params.season
    }
    const options = {
        filter: params,
        populate: ["vessel", "cabinCategory", "cruiseType", "market", "season"]
    }
    const prices = await priceService.findAll(options)

    res.json({
        success: true,
        message: "Prices fetched",
        data: prices
    })

});


const updatePrice = asyncErrorWrapper(async (req, res, next) => {
    const updatedPrice = await priceService.update(req.params.price, req.body)

    if (!updatedPrice) return next(new CustomError("Price couldn't updated"), 400)
    res.json({
        success: true,
        message: "Price Updated Successfully",
        data: updatedPrice
    })
})

const deletePrice = asyncErrorWrapper(async (req, res, next) => {

    const deletedPrice = await priceService.del(req.params.price)
    if (!deletedPrice) return next(new CustomError("Price couldn't deleted"), 400)

    res.json({
        success: true,
        message: "Price deleted Successfully",
        data: deletedPrice
    })


})

const calculateFrontEndPrice = asyncErrorWrapper(async (req, res, next) => {
    let cabinList = []
    let totalCabinPrice = 0;
    req.body.selectedCruise.cabinCategory = "5f5e3340aaecba0bcc7cec51"

    const params = {
        vessel: req.body.selectedCruise.vessel._id,
        cruiseType: req.body.selectedCruise.cruiseType._id,
        market: req.body.selectedCruise.market,
        season: req.body.selectedCruise.season._id,
        cabinCategory: req.body.selectedCruise.cabinCategory
    }
    const options = {
        filter: params,
        populate: ["vessel", "cabinCategory", "cruiseType", "market", "season"]
    }
    const prices = await priceService.findAll(options)

    let tax = prices[0].cruiseType.tax;
    let cabinPrice = prices[0].endUserPrice - tax;
    

    req.body.selectedCabin.forEach(element => {
        let calculatePrice = new CalculatePrice.PriceFrontEnd(cabinPrice, tax, element.rosPrice, element.isRose, Number(element.numberOfAdult), Number(element.numberOfChild));
        let calculatedPriceWithCabin = {
            cabinNumber: null,
            totalPassengers: 0,
            cabinPrice: 0,
        }
        calculatedPriceWithCabin.cabinNumber = element.number
        calculatedPriceWithCabin.cabinPrice = calculatePrice.calculate();
        calculatedPriceWithCabin.totalPassengers = Number(element.numberOfAdult) + Number(element.numberOfChild);
        totalCabinPrice += calculatedPriceWithCabin.cabinPrice

        cabinList.push(calculatedPriceWithCabin);
    });

    //if (!calculatedPriceTotal) return next(new CustomError("Price couldn't calculated"), 400)

    res.json({
        success: true,
        message: "Price Calculated Successfully",
        data: {
            cabinList,
            totalCabinPrice
        }
    })

})

const calculateBackEndPrice = asyncErrorWrapper(async (req, res, next) => {
    let booking = req.body;
    let bookingPrice = [];

    for (let index = 0; index < booking.length; index++) {
        const element = booking[index];
        const params = {
            vessel: element.cabin.vessel,
            cruiseType: element.cruise.cruiseType._id,
            market: element.agency.market,
            season: element.cruise.season,
            cabinCategory: element.cabin.cabinCategory._id
        }

        const options = {
            filter: params,
            populate: ["vessel", "cabinCategory", "cruiseType", "market", "season"]
        }

        const prices = await priceService.findAll(options)

        let tax = element.cruise.cruiseType.tax;
        let cabinPrice = prices[0].endUserPrice-tax;
        
        let rosPrice = element.rosPrice;
        let isRose = element.isRose;
        let passengers = element.Passengers;

        let cabinNumber = Number(element.cabin.number);
        let passengersCount = Number(element.Passengers.length);

        let calculatePrice = new CalculatePrice.PriceBackEnd(cabinPrice, tax, rosPrice, isRose, passengers).calculate();

        let data = {
            cabinNumber,
            calculatePrice,
            passengersCount
        }
        bookingPrice.push(data);
        console.log("bookingPrice", bookingPrice);
    }

    res.json({
        success: true,
        message: "Price Calculated Successfully",
        data: bookingPrice
    })
})

const calculateBackEndPriceObject = asyncErrorWrapper(async (req, res, next) => {

    let booking = req.body;
    let calculatePrice = 0;
    const params = {
        vessel: booking.cabin.vessel,
        cruiseType: booking.cruise.cruiseType._id,
        market: booking.agency.market,
        season: booking.cruise.season,
        cabinCategory: booking.cabin.cabinCategory._id
    }

    const options = {
        filter: params,
        populate: ["vessel", "cabinCategory", "cruiseType", "market", "season"]
    }

    const prices = await priceService.findAll(options)

    let tax = booking.cruise.cruiseType.tax;
    let cabinPrice = prices[0].endUserPrice-tax;
    
    let rosPrice = booking.rosPrice;
    let isRose = booking.isRose;
    let passengers = booking.Passengers;

    calculatePrice=new CalculatePrice.PriceBackEnd(cabinPrice, tax, rosPrice, isRose, passengers).calculate()

    res.json({
        success: true,
        message: "Price Calculated Successfully",
        data: calculatePrice
    })
})

module.exports = {
    addPrice,
    getPrices,
    updatePrice,
    deletePrice,
    calculateFrontEndPrice,
    calculateBackEndPrice,
    calculateBackEndPriceObject
}