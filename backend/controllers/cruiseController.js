const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const cruiseService = require("../services/cruise-service");
const cruise = require("../models/cruise")
var moment = require("moment")

const addCruise = asyncErrorWrapper( async (req,res,next) =>{

    const cruise = req.body
    // cruise.checkInDate = moment(req.body.checkInDate, "DD-MM-YYYY hh:mm").format('LLL')
    // cruise.checkOutDate = moment(req.body.checkOutDate, "DD-MM-YYYY hh:mm").format('LLL')

    const addedCruise = await cruiseService.add(cruise);

    //if(!cruise) return next(new CustomError("Country Couldn't add",400));

    res.json({
        success : true,
        message : "Cruise added succesfully",
        data : [addedCruise]
    })    

});

const updateCruise = asyncErrorWrapper( async(req,res,next)=>{
    const updatedCruise= await cruiseService.update(req.params.id, req.body)

    if(!updatedCruise) return next(new CustomError("Cruise couldn't updated"),400)
    res.json({
        success : true,
        message : "Cruise Updated Successfully",
        data : updatedCruise
    })
});

const getCruises = asyncErrorWrapper( async (req,res,next) =>{

    const options = {
        filter : null,
        populate : ["ports", "vessel", "cruiseType", "season", "schedule.port"]
    }
    const cruises = await cruiseService.findAll(options)
    res.json({
        success:true,
        message : "Cruises fetched",
        data : cruises
    })
});

const getCruisesbyCruiseType = asyncErrorWrapper (async (req,res,next) => {
    const cruiseType = req.params.cruiseType

    const options = {
        filter : {cruiseType},
        populate : ["ports", "vessel", "cruiseType", "season", "schedule.port"]
    }
    const cruises = await cruiseService.findAll(options)
    res.json({
        success:true,
        message : "Cruises fetched",
        data : cruises
    })

});

const cruiseDetail = asyncErrorWrapper (async (req,res,next) => {
    const cruiseid = req.params.id

    const options = {
        filter : {_id:cruiseid},
        populate : ["ports", "vessel", "cruiseType", "season", "schedule.port"]
    }
    const cruises = await cruiseService.findAll(options)
    res.json({
        success:true,
        message : "Cruises Detail fetched",
        data : cruises
    })

});

module.exports = {
    addCruise,
    getCruises,
    updateCruise,
    getCruisesbyCruiseType,
    cruiseDetail
}