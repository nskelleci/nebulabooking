const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const bookingService = require("../services/bookingService");
var tokenHelper = require('../Helpers/authorization/tokenHelpers')
const agencyService = require('../services/agency-service')
const cruiseService = require("../services/cruise-service")

const createBooking = asyncErrorWrapper(async (req, res, next) => {

    const booking = req.body


    var decoded = tokenHelper.verifyToken(req)
    var agency = await agencyService.find(decoded._id)
    booking.agency = await agency.populate(["agencyType"]).execPopulate()
    booking.agencyCost = calculateAgencyCost(booking);
    // cruise.checkOutDate = moment(req.body.checkInDate, "DD-MM-YYYY hh:mm").format('LLL')
    // cruise.checkOutDate = moment(req.body.checkOutDate, "DD-MM-YYYY hh:mm").format('LLL')

    let createdBooking = await bookingService.add(booking);

    if (!createBooking) return next(new CustomError("Bookung Couldn't Created", 400));
    createdBooking = await createdBooking.populate(['cabin', 'cruise']).execPopulate()

    res.json({
        success: true,
        message: "Booking added succesfully",
        data: [createdBooking]
    })

});

const getAllbookingsbyagency = asyncErrorWrapper(async (req, res, next) => {
    var decodedAgency = tokenHelper.verifyToken(req)
    console.log("decodedagency=====", decodedAgency)
    const options = {
        filter: { agency: decodedAgency },
        populate: ["agency", "vessel", "cruiseType", "season", "cruise", "cabin", "Passengers"]
    }

    let bookings = await bookingService.findAll(options)


    console.log("bookingsssssss", bookings)
    res.json({
        success: true,
        message: "Bookings fetched",
        data: bookings
    })
});


const getAllbookingsbyagencydetail = asyncErrorWrapper(async (req, res, next) => {
    var decodedAgency = tokenHelper.verifyToken(req)
    console.log("decodedagency=====", decodedAgency)
    const options = {
        filter: { agency: decodedAgency },
        populate: ["agency", "vessel", "cruiseType", "season", "cruise", "cabin", "Passengers"]
    }

    let bookings = await bookingService.findAll(options)

    let totalPrice=0
    let agencyCost=0
    let balance=0
    let profit=0
    bookings.forEach((element)=>{
        totalPrice+=Number(element.totalPrice);
        agencyCost+=Number(element.agencyCost);
        balance+=Number(element.balance);
        profit+=Number(element.profit);
    })

    
    //console.log("bookingsssssss", bookings)

    res.json({
        success: true,
        message: "Bookings Detail fetched",
        data: {
            totalPrice,
            agencyCost,
            balance,
            profit
        }
    })
    
});



const updateBooking = asyncErrorWrapper(async (req, res, next) => {
    let booking = req.body;


    booking.agencyCost = calculateAgencyCost(booking);

    let totalPaid = 0;

    booking.paidAmount.forEach(element => {
        totalPaid += Number(element.price)
    });
    
    booking.balance = Math.round((Number(totalPaid)-Number(booking.agencyCost) + Number.EPSILON) * 100) / 100;

    booking.profit = Math.round((Number(booking.totalPrice) - Number(booking.agencyCost)+ Number.EPSILON) * 100) / 100;

    let updatedBooking = await bookingService.update(req.params.booking, booking)

    if (!updatedBooking) return next(new CustomError("Booking couldn't updated"), 400)

    //updatedBooking = await updatedBooking.populate(["agencyType"]).execPopulate()
    res.json({
        success: true,
        message: "Booking Updated Successfully",
        data: updatedBooking
    })
})

const getBooking = asyncErrorWrapper(async (req, res, next) => {

    const bookingId = req.params.booking

    const options = {
        filter: { _id: bookingId },
        populate: ["agency", "agency.agencyType", "vessel", "cruiseType", "season", "cruise", "cabin", "Passengers","schedule"],
        select: null
    }

    const booking = await bookingService.findOneby(options)

    if (!booking) return next(new CustomError("Booking couldn't found", 200))

    res.json({
        success: true,
        data: booking
    })
});

const getBookingCruiseId = asyncErrorWrapper(async (req, res, next) => {

    const cruiseid = req.params.id
    const cruise = await cruiseService.find(cruiseid)
    if (!cruise) {
        return next(new CustomError("Cruise couldn't find"), 400)
    }
    const options = {
        filter: { cruise },
        populate: ["agency", "vessel", "cruiseType", "cruise.schedule.port", "cruise", "cabin", "Passengers"],
        select: null
    }

    const booking = await bookingService.findAll(options)

    if (!booking) return next(new CustomError("Booking couldn't found", 200))

    res.json({
        success: true,
        data: booking
    })
});


const bookingToday = asyncErrorWrapper(async (req, res, next) => {
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    console.log({ $gte: start, $lt: end });

    const pendingPayment = {
        filter: { status: "pending payment", createdAt: { "$gte": start, "$lt": end } },
        populate: ["agency", "vessel", "cruiseType", "cruise.schedule.port", "cruise", "cabin", "Passengers"],
        select: null
    }

    const sold = {
        filter: { status: "Sold", createdAt: { "$gte": start, "$lt": end } },
        populate: ["agency", "vessel", "cruiseType", "cruise.schedule.port", "cruise", "cabin", "Passengers"],
        select: null
    }

    let todayPendingPayment = await bookingService.findToday(pendingPayment)
    let todaySold = await bookingService.findToday(sold)

    todayPendingPayment = todayPendingPayment.length
    todaySold = todaySold.length

    let todayData = {
        todayPendingPayment,
        todaySold
    }

    res.json({
        success: true,
        data: todayData
    })
});

function calculateAgencyCost(booking) {

    console.log("booking -->", booking);
    let agencyCost = Number(booking.totalPrice) - (((Number(booking.totalPrice) - (Number(booking.Passengers.length) * Number(booking.cruise.cruiseType.tax))) / 100) * Number(booking.agency.agencyType.discount))
    console.log("agencyCost -->", agencyCost);
    return agencyCost;
}



module.exports = {
    createBooking,
    getAllbookingsbyagency,
    updateBooking,
    getBooking,
    getBookingCruiseId,
    bookingToday,
    getAllbookingsbyagencydetail
}