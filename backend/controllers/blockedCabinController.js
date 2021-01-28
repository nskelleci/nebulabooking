const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const blockedCabinService = require("../services/blocked-cabin-service")
const tokenHelper = require("../Helpers/authorization/tokenHelpers")
const agencyService = require("../services/agency-service");
const cruiseService = require("../services/cruise-service");
const addBlockedCabin = asyncErrorWrapper( async(req,res,next)=>{

    var decoded = tokenHelper.verifyToken(req)
    var agency = await agencyService.find(decoded._id)
    let blockedCabin = req.body

    blockedCabin.blockedFor = agency

    const createdBlockedCabin = await blockedCabinService.add(blockedCabin)

    res.json({
        success:true,
        message : "Cabin blocked Succesfully",
        data : createdBlockedCabin
    })

});

const updateBlockedCabin = asyncErrorWrapper( async(req,res,next)=>{
    //console.log("----------->",req.body);
    const options = {
        filter :{cruise:req.body.cruise, cabin:req.body.cabin},
    }
    const blockedCabin = await blockedCabinService.findOneby(options)
    //console.log("blockedCabin----------->",blockedCabin);
    
    blockedCabin.blockReason = req.body.blockReason
    const updatedBlockedCabin = await blockedCabinService.update(blockedCabin._id, blockedCabin)

    if(!updatedBlockedCabin) return next(new CustomError("Blocked cabin couldn't updated"),400)

    res.json({
        success : true,
        message : "Blocked Cabin Updated Successfully",
        data : updatedBlockedCabin
    })
    

});

const getAllBlockedCabinsByCruise = asyncErrorWrapper( async(req,res,next)=>{

    const cruiseId = req.params.cruiseId
    const cruiseOptions = {
        filter :{_id:cruiseId},
    }
    const cruise = await cruiseService.findOneby(cruiseOptions)
    console.log("cruise====", cruise)
    const options = {
        filter :{cruise},
        populate : ["cruise", "cabin", "agency"]
    }
    const blockedCabins = await blockedCabinService.findAll(options)
    res.json({
        success:true,
        message : "Blocked Cabins for - " + cruise.name,
        data : blockedCabins
    })
})

const getAllblockedCabins = asyncErrorWrapper(async (req,res,next)=>{

    const blockedCabins = await blockedCabinService.findAll()
    res.json({
        success:true,
        message : "All Blocked Cabins fethced" ,
        data : blockedCabins
    })
})

const getBlockedCabin = asyncErrorWrapper(async (req,res,next)=>{
    const body = req.body

    const options = {
        filter :{cabin:body.cabin,cruise:body.cruise},
    }

    const blockedCabin = await blockedCabinService.findAll(options)

    if(!blockedCabin) return next(new CustomError("Blocked Cabin couldn't found"),400)

    res.json({
        success:true,
        message : "Blocked Cabin fethced" ,
        data : blockedCabin
    })
    
})

module.exports = {
    addBlockedCabin,
    getAllBlockedCabinsByCruise,
    getAllblockedCabins,
    updateBlockedCabin,
    getBlockedCabin
}