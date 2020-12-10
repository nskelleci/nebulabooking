const CustomError = require("../../Helpers/error/CustomError")
const jwt = require ("jsonwebtoken")
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../Helpers/authorization/tokenHelpers")

const getAccessToRoute = (req,res,next)=>{
    // TOKEN
    const {JWT_SECRET_KEY} = process.env;
    if(!isTokenIncluded(req)){
        return next(new CustomError("You are not authorized to access",401))
    }

    const accessToken = getAccessTokenFromHeader(req)
    jwt.verify(accessToken, JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            return next(new CustomError("You are not authorized to access", 401))
        }
        req.agency = {
            _id : decoded.id,
            agencyCode : decoded.agencyCode,
            companyName : decoded.companyName,
            email : decoded.email,
            authorizedPerson : decoded.authorizedPerson
        }
        next();
    })
    
    //CUSToM ERROR
}

module.exports = {
    getAccessToRoute
}