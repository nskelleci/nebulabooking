const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const cabinService = require("../services/cabin-service")
const cruiseService = require("../services/cruise-service")
const cabinCategoryService = require("../services/cabin-categories")


const addCabin = asyncErrorWrapper( async(req,res,next)=>{

    const cabin = await cabinService.add(req.body)

    res.json({
        success:true,
        message : "Cabin Added Succesfully",
        data : cabin
    })

});

const getAllCabinsbyVessel = asyncErrorWrapper( async(req,res,next)=>{

    const vessel = req.params.vessel
    const options = {
        filter : {vessel},
        populate : ["vessel", "bedType", "cabinCategory"]
    }
    const cabins = await cabinService.findAll(options)
    res.json({
        success:true,
        message : "All Cabins",
        data : cabins
    })
});

const getAllCabins = asyncErrorWrapper( async(req,res,next)=>{

    
    const cabins = await cabinService.findAll()
    res.json({
        success:true,
        message : "All Cabins",
        data : cabins
    })
});

const getAllAvailableCabins = asyncErrorWrapper (async (req,res,next)=>{
    const cruiseid = req.params.cruise
    const cruise = await cruiseService.find(cruiseid)
    const cabinCategoryId = req.params.cabinCategoryId
    const cabinCategory = await cabinCategoryService.find(cabinCategoryId)
    const options = {
        populate : ["vessel", "bedType", "cabinCategory"],
        cruise : cruise,
        cabinCategory : cabinCategory

    }

    const cabins = await cabinService.findAvailableCabins(options)

    res.json({
        success : true,
        message : "Available cabins fetched for selected cruise",
        arrayLength : cabins.length,
        data : cabins
    })
})

const getAvailableCabinsBycabinCategory = asyncErrorWrapper(async (req,res,next)=>{
        const cruiseid = req.params.cruise
        const cruise = await cruiseService.find(cruiseid)
        const cabinCategoryId = req.params.cabinCategory
        const cabinCategory = await cabinCategoryService.find(cabinCategoryId)
        
        const options = {
            populate : ["vessel", "bedType", "cabinCategory"],
            cruise : cruise,
            cabinCategory : cabinCategory
    
        }
    
        const cabins = await cabinService.findAvailableCabinsByCabinCategory(options)
        
        res.json({
            success : true,
            message : "Available cabins fetched for selected cruise",
            arrayLength : cabins.length,
            data : cabins
        })
    }
)

const updateCabin = asyncErrorWrapper( async(req,res,next)=>{

    const updatedCabin= await cabinService.update(req.params.id, req.body)

    if(!updatedCabin) return next(new CustomError("Cabin couldn't updated"),400)
    res.json({
        success : true,
        message : "Cabin Updated Successfully",
        data : updatedCabin
    })

});

module.exports = {
    addCabin,
    getAllCabinsbyVessel,
    updateCabin,
    getAllAvailableCabins,
    getAllCabins,
    getAvailableCabinsBycabinCategory
}