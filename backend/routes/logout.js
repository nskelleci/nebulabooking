const express = require("express");
const router = express.Router();
var tokenHelper = require('../Helpers/authorization/tokenHelpers')

router.post("/", (req,res,next)=>{
    let result = tokenHelper.clearCookie(req,res,next)
    if(result){
        res.json({
            success : true,
            message : "Logout Successfully"
        })
    }
})


module.exports = router