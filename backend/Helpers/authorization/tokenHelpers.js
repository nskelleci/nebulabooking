const jwt = require("jsonwebtoken");

const sendJwtToClient = (agency, res)=>{
    //GENERATE JWT
        const token = agency.generateJwtFromAgency();
        const {JWT_COOKIE,NODE_ENV} = process.env;
        return res
            .status(200)
            .cookie('access_token', token,{
                httpOnly : true,
                expires : new Date(Date.now() + parseInt(JWT_COOKIE)*1000*60),
                sameSite : 'none',
                secure : true
                //secure : NODE_ENV==="DEVELOPMENT" ? false : true
            })
            .json({
                success : true,
                message : 'Agency Logged-in Successfully',
                // access_token : token,
                data :{
                    _id : agency._id,
                    agencyCode : agency.agencyCode,
                    email : agency.email,
                    companyName : agency.companyName,
                    authorizedPerson : agency.authorizedPerson,
                    agencyType : agency.agencyType,
                    role : agency.role
                }
            })
};

const isTokenIncluded = (req)=>{
    return (req.headers.cookie)
    };

const verifyToken = (req,res,next) =>{
    let accessToken = getAccessTokenFromHeader(req)
    
    let payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
    return payload 
}

const getAccessTokenFromHeader = (req) =>{
    let cookie="";
    cookie = req.headers.cookie;
    const access_token = req.headers.cookie.split("access_token=")[1];

    return access_token;
}

module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader,
    verifyToken
};
