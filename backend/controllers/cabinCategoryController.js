const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../Helpers/error/CustomError");
const cabinCategoryService = require("../services/cabin-categories")

const addCabinCategory = asyncErrorWrapper( async(req,res,next)=>{

    const cabinCategory = await cabinCategoryService.add(req.body)

    res.json({
        success:true,
        message : "Cabin Category Added Succesfully",
        data : cabinCategory
    })

});

const updateCabinCategory = asyncErrorWrapper( async(req,res,next)=>{

    const updatedCabinCategory = await cabinCategoryService.update(req.params.id, req.body)

    if(!updatedCabinCategory) return next(new CustomError("Cabin Category couldn't updated"),400)
    res.json({
        success : true,
        message : "Cabin Category Updated Successfully",
        data : updatedCabinCategory
    })

});

const getAllCabinCategoriesbyVessel = asyncErrorWrapper( async(req,res,next)=>{

    const vessel = req.params.vessel
    const options = {
        filter : {vessel},
        populate : ["vessel"]
    }
    const cabinCategories = await cabinCategoryService.findAll(options)
    res.json({
        success:true,
        message : "All Cabin Categories",
        data : cabinCategories
    })
})

module.exports = {
    addCabinCategory,
    getAllCabinCategoriesbyVessel,
    updateCabinCategory
    
}