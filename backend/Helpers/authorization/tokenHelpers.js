const { verify } = require("jsonwebtoken");

const sendJwtToClient = (agency, res)=>{
    //GENERATE JWT
        const token = agency.generateJwtFromAgency();
        const {JWT_COOKIE,NODE_ENV} = process.env;
        return res
            .status(200)
            .cookie('access_token', token,{
                httpOnly : true,
                expires : new Date(Date.now() + parseInt(JWT_COOKIE)*1000*60),
                sameSite : 'strict',
                //secure : true
                //secure : NODE_ENV==="DEVELOPMENT" ? false : true
            })
            .json({
                success : true,
                message : 'Agency Logged-in Successfully',
                // access_token : token,
                data :{
                    id : agency._id,
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
    let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    return payload 
}

const getAccessTokenFromHeader = (req) =>{
    const cookie = req.headers.cookie;
    const access_token = cookie.split("access_token=")[1];
    return access_token;
}

module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader,
    verifyToken
};