const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const blockedCabinService = require("../services/blocked-cabin-service")
const tokenHelper = require("../Helpers/authorization/tokenHelpers")
const agencyService = require("../services/agency-service")
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

    const updatedBlockedCabin = await blockedCabinService.update(req.params.id, req.body)

    if(!updatedBlockedCabin) return next(new CustomError("Blocked cabin couldn't updated"),400)

    res.json({
        success : true,
        message : "Blocked Cabin Updated Successfully",
        data : updatedBlockedCabin
    })

});

const getAllBlockedCabinsByCruise = asyncErrorWrapper( async(req,res,next)=>{

    const cruiseId = req.params.cruiseId
    const options = {
        filter :{cruiseId},
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

module.exports = {
    addBlockedCabin,
    getAllBlockedCabinsByCruise,
    getAllblockedCabins,
    updateBlockedCabin
}