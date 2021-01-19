const AgencyService = require("../services/agency-service")
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../Helpers/authorization/tokenHelpers");
const agencyService = require("../services/agency-service");



const createAgency = asyncErrorWrapper( async (req,res,next)=>{   
    const agency =  await AgencyService.add(req.body);

    if(!agency) return next(new CustomError("Vessel Couldn't add",400));

    res.json({
        success : true,
        message : "Agency added succesfully",
        data : agency
    })   

    sendJwtToClient(agency, res);
})

const updateAgency = asyncErrorWrapper( async(req,res,next)=>{

    const updatedAgency = await AgencyService.update(req.params.id, req.body)

    if(!updatedAgency) return next(new CustomError("Agency couldn't updated"),400)
    res.json({
        success : true,
        message : "Agency Updated Successfully",
        data : updatedAgency
    })

});

const getAgency = asyncErrorWrapper( async(req,res,next)=>{

    const options = {
        filter : req.decoded._id,
        populate : ["agencyType", "market"]
    }
    const agency = await AgencyService.find(options)
    res.json({
        success:true,
        message : "Agency",
        data : agency
    })
})

const getAllAgencies = asyncErrorWrapper( async(req,res,next)=>{

    const options = {
        filter : null,
        populate : ["agencyType", "market"]
    }
    const agencies = await AgencyService.findAll(options)
    res.json({
        success:true,
        message : "All Agencies",
        data : agencies
    })
})

const tokentest = (req,res,next)=>{
    res.json({
        success : true,
    })
}

module.exports = {createAgency, tokentest, updateAgency, getAllAgencies, getAgency};