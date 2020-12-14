const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const blockedCabinService = require("../services/blocked-cabin-service");
const cruiseService = require("../services/cruise-service")


const getCruiseListwithOccupancy = asyncErrorWrapper( async(req,res,next)=>{

    let cruises = await cruiseService.findAll();
    
    res.json({
        success:true,
        message : "cruise list fetched Succesfully",
        data : cruises
    })

});




module.exports = {
    getCruiseListwithOccupancy
}