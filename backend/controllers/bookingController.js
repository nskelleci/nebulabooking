const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const bookingService = require("../services/bookingService");
var tokenHelper = require('../Helpers/authorization/tokenHelpers')
const agencyService = require('../services/agency-service')
const cruiseService = require("../services/cruise-service");
const { compare } = require("bcryptjs");

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

    let totalPrice = 0
    let agencyCost = 0
    let balance = 0
    let profit = 0
    bookings.forEach((element) => {
        totalPrice += Number(element.totalPrice);
        agencyCost += Number(element.agencyCost);
        balance += Number(element.balance);
        profit += Number(element.profit);
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

    booking.balance = Math.round((Number(totalPaid) - Number(booking.agencyCost) + Number.EPSILON) * 100) / 100;

    booking.profit = Math.round((Number(booking.totalPrice) - Number(booking.agencyCost) + Number.EPSILON) * 100) / 100;

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
        populate: ["agency", "agency.agencyType", "vessel", "cruiseType", "season", "cruise", "cabin", "Passengers", "schedule"],
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

const bookingPriceStatistic = asyncErrorWrapper(async (req, res, next) => {
    var startOneDay = new Date();
    startOneDay.setHours(0, 0, 0, 0);
    var endOneDay = new Date();
    endOneDay.setHours(23, 59, 59, 999);
    //////////////////////////////////////
    var startOneWeek = new Date();
    startOneWeek.setHours(0, 0, 0, 0);
    startOneWeek.setDate(startOneWeek.getDate() - 7);
    var endOneWeek = new Date();
    endOneWeek.setHours(23, 59, 59, 999);
    //////////////////////////////////////
    var startOneMonth = new Date();
    startOneMonth.setHours(0, 0, 0, 0);
    startOneMonth.setMonth(startOneMonth.getMonth() - 1);
    var endOneMonth = new Date();
    endOneMonth.setHours(23, 59, 59, 999);

    //-------------TODAY----------------------------------------------
    //todayTotalPrice
    let aggregateTotalPriceToday = [
        { $match: { createdAt: { $gte: startOneDay, $lte: endOneDay } } },
        { $group: { _id: null, totalPrice: { $sum: "$totalPrice" } } }
    ]

    let todayTotalPrice = 0;
    let totalPriceTodayService = await bookingService.aggregate(aggregateTotalPriceToday)
    if (totalPriceTodayService.length > 0) {
        todayTotalPrice = totalPriceTodayService[0].totalPrice
    }


    //todayAgencyCost
    let aggregateAgencyCostToday = [
        { $match: { createdAt: { $gte: startOneDay, $lte: endOneDay } } },
        { $group: { _id: null, agencyCost: { $sum: "$agencyCost" } } }
    ]

    let agencyCostTodayService = await bookingService.aggregate(aggregateAgencyCostToday)
    let todayAgencyCost = 0;
    if (agencyCostTodayService.length > 0) {
        todayAgencyCost = agencyCostTodayService[0].agencyCost
    }


    //todayBalance
    let aggregateBalanceToday = [
        { $match: { createdAt: { $gte: startOneDay, $lte: endOneDay } } },
        { $group: { _id: null, balance: { $sum: "$balance" } } }
    ]

    let balanceTodayService = await bookingService.aggregate(aggregateBalanceToday)
    let todayBalance = 0;
    if (balanceTodayService.length > 0) {
        todayBalance = balanceTodayService[0].balance
    }


    //-------------WEEK----------------------------------------------
    //weekTotalPrice
    let aggregateTotalPriceWeek = [
        { $match: { createdAt: { $gte: startOneWeek, $lte: endOneWeek } } },
        { $group: { _id: null, totalPrice: { $sum: "$totalPrice" } } }
    ]

    let totalPriceWeekService = await bookingService.aggregate(aggregateTotalPriceWeek)
    let weekTotalPrice = 0
    if (totalPriceWeekService.length > 0) {
        weekTotalPrice = totalPriceWeekService[0].totalPrice
    }

    //weekAgencyCost
    let aggregateAgencyCostWeek = [
        { $match: { createdAt: { $gte: startOneWeek, $lte: endOneWeek } } },
        { $group: { _id: null, agencyCost: { $sum: "$agencyCost" } } }
    ]

    let agencyCostWeekService = await bookingService.aggregate(aggregateAgencyCostWeek)
    let weekAgencyCost = 0
    if (agencyCostWeekService.length > 0) {
        weekAgencyCost = agencyCostWeekService[0].agencyCost
    }


    //weekBalance
    let aggregateBalanceWeek = [
        { $match: { createdAt: { $gte: startOneWeek, $lte: endOneWeek } } },
        { $group: { _id: null, balance: { $sum: "$balance" } } }
    ]

    let balanceWeekService = await bookingService.aggregate(aggregateBalanceWeek)
    let weekBalance = 0
    if (balanceWeekService.length > 0) {
        weekBalance = balanceWeekService[0].balance
    }



    //-------------MONTH----------------------------------------------
    //monthTotalPrice
    let aggregateTotalPriceMonth = [
        { $match: { createdAt: { $gte: startOneMonth, $lte: endOneMonth } } },
        { $group: { _id: null, totalPrice: { $sum: "$totalPrice" } } }
    ]

    let totalPriceMonthService = await bookingService.aggregate(aggregateTotalPriceMonth)
    let monthTotalPrice = 0
    if (totalPriceMonthService.length > 0) {
        monthTotalPrice = totalPriceMonthService[0].totalPrice
    }


    //monthAgencyCost
    let aggregateAgencyCostMonth = [
        { $match: { createdAt: { $gte: startOneMonth, $lte: endOneMonth } } },
        { $group: { _id: null, agencyCost: { $sum: "$agencyCost" } } }
    ]

    let agencyCostMonthService = await bookingService.aggregate(aggregateAgencyCostMonth)
    let monthAgencyCost = 0
    if (agencyCostMonthService.length > 0) {
        monthAgencyCost = agencyCostMonthService[0].agencyCost
    }


    //monthBalance
    let aggregateBalanceMonth = [
        { $match: { createdAt: { $gte: startOneMonth, $lte: endOneMonth } } },
        { $group: { _id: null, balance: { $sum: "$balance" } } }
    ]

    let balanceMonthService = await bookingService.aggregate(aggregateBalanceMonth)
    let monthBalance = 0
    if (balanceMonthService.length > 0) {
        monthBalance = balanceMonthService[0].balance
    }



    //-------------ALL----------------------------------------------
    //monthTotalPrice
    let aggregateTotalPriceAll= [
        { $group: { _id: null, totalPrice: { $sum: "$totalPrice" } } }
    ]

    let totalPriceAllService = await bookingService.aggregate(aggregateTotalPriceAll)
    let allTotalPrice = 0
    if (totalPriceAllService.length > 0) {
        allTotalPrice = totalPriceAllService[0].totalPrice
    }


    //monthAgencyCost
    let aggregateAgencyCostAll = [
        { $group: { _id: null, agencyCost: { $sum: "$agencyCost" } } }
    ]

    let agencyCostAllService = await bookingService.aggregate(aggregateAgencyCostAll)
    let allAgencyCost = 0
    if (agencyCostAllService.length > 0) {
        allAgencyCost = agencyCostAllService[0].agencyCost
    }


    //monthBalance
    let aggregateBalanceAll = [
        { $group: { _id: null, balance: { $sum: "$balance" } } }
    ]

    let balanceAllService = await bookingService.aggregate(aggregateBalanceAll)
    let allBalance = 0
    if (balanceAllService.length > 0) {
        allBalance = balanceAllService[0].balance
    }


    res.json({
        success: true,
        today: {
            todayTotalPrice,
            todayAgencyCost,
            todayBalance,
        },
        week: {
            weekTotalPrice,
            weekAgencyCost,
            weekBalance,
        },
        month: {
            monthTotalPrice,
            monthAgencyCost,
            monthBalance,
        },
        all: {
            allTotalPrice,
            allAgencyCost,
            allBalance,
        }
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
    bookingPriceStatistic,
    updateBooking,
    getBooking,
    getBookingCruiseId,
    bookingToday,
    getAllbookingsbyagencydetail
}