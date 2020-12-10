const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const bookingService = require("../services/bookingService");
var tokenHelper = require('../Helpers/authorization/tokenHelpers')
const agencyService = require('../services/agency-service')
const cruiseService = require("../services/cruise-service")

const createBooking = asyncErrorWrapper( async (req,res,next) =>{

    const booking = req.body

    var decoded = tokenHelper.verifyToken(req)
    var agency = await agencyService.find(decoded._id)
    booking.agency = agency
    // cruise.checkInDate = moment(req.body.checkInDate, "DD-MM-YYYY hh:mm").format('LLL')
    // cruise.checkOutDate = moment(req.body.checkOutDate, "DD-MM-YYYY hh:mm").format('LLL')

    let createdBooking = await bookingService.add(booking);

    if(!createBooking) return next(new CustomError("Bookung Couldn't Created",400));
    createdBooking = await createdBooking.populate(['cabin', 'cruise']).execPopulate()
    res.json({
        success : true,
        message : "Booking added succesfully",
        data : [createdBooking]
    })    

});

const getAllbookingsbyagency = asyncErrorWrapper( async (req,res,next) =>{
    var decodedAgency = tokenHelper.verifyToken(req)
    console.log("decodedagency=====", decodedAgency )
    const options = {
        filter : {agency:decodedAgency},
        populate : ["agency", "vessel", "cruiseType", "season", "cruise","cabin", "Passengers"]
    }

    let bookings = await bookingService.findAll(options)

    
    console.log("bookingsssssss",bookings)
    res.json({
        success:true,
        message : "Bookings fetched",
        data : bookings
    })
});

const updateBooking = asyncErrorWrapper (async (req, res, next) => {
    const updatedBooking= await bookingService.update(req.params.booking, req.body)

    if(!updatedBooking) return next(new CustomError("Booking couldn't updated"),400)
    res.json({
        success : true,
        message : "Booking Updated Successfully",
        data : updatedBooking
    })
})

const getBooking = asyncErrorWrapper( async (req,res,next) =>{

    const bookingId = req.params.booking

    const options = {
        filter : {_id:bookingId},
        populate : ["agency", "vessel", "cruiseType", "season", "cruise","cabin","Passengers"],
        select : null
    }

    const booking = await bookingService.findOneby(options)

    if(!booking) return next(new CustomError("Booking couldn't found", 200))

    res.json({
        success: true,
        data : booking
    })
});


module.exports = {
    createBooking,
    getAllbookingsbyagency,
    updateBooking,
    getBooking
}