const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const passengerService = require("../services/passenger-service");
const price = require("../models/passenger")
var moment = require("moment")

const addPassenger = asyncErrorWrapper( async (req,res,next) =>{

    const passenger = req.body
    passenger.Dob = moment(req.body.Dob, "DD-MM-YYYY hh:mm").format('LLL')
    passenger.passportIssueDate = moment(req.body.passportIssueDate, "DD-MM-YYYY hh:mm").format('LLL')
    passenger.passportExpiryDate = moment(req.body.passportExpiryDate, "DD-MM-YYYY hh:mm").format('LLL')

    const addedPassenger = await passengerService.add(passenger);

    if(!addedPassenger) return next(new CustomError("Passport No or InternationalIdNo to be unique",400));

    res.json({
        success : true,
        message : "Passenger added succesfully",
        data : [addedPassenger]
    })    

});

const getPassenger = asyncErrorWrapper( async (req,res,next) =>{
    const passportNo = req.params.passportNo
    const options = {
        filter : {passportNo},
        populate : null,
        select : null
    }
    const passenger = await passengerService.findOneby(options)

    if(!passenger) return next(new CustomError("Passenger couldn't found", 200))

    res.json({
        success : true,
        message : "Passenger fetched successfully",
        data : passenger
    })
    console.log(passenger)
})

// const getPassengersByBooking = asyncErrorWrapper( async (req,res,next) =>{

//     const params = {
//         booking : req.params.bookingid,
//     } 
//     const options = {
//         filter : params,
//         populate : []
//     }
//     const passengers = await passengerService.findAll(options)
//     res.json({
//         success:true,
//         message : "passengers fetched",
//         data : passengers
//     })
// });

module.exports = {
    addPassenger,
    getPassenger
}