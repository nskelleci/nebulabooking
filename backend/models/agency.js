const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const cryptoRandomString = require('crypto-random-string');
const jwt = require("jsonwebtoken")

const Schema = mongoose.Schema;

const AgencySchema = new Schema({
    email : {
        type : String,
        required : [true,"Please provide an email"],
        unique : [true,"Please try different email"],
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email address"]
    },
    password :{
        type : String,
        required : [true,"Please enter your password"],
        minlength : [6,"Please provide a password with min length 6"],
        select : false
    },
    companyName : {
        type : String,
        minlength : [3, "Company name lenght can't be less than 3 character"],
        maxlength : [100,"Company name length over (100) character limit"],
        required : [true, "Please provide the company name"],
    },
    address : {
        type : String,
        minlength : [3, "Company adddress lenght can't be less than 3 character"],
        maxlength : [400,"Company adddress length over (400) character limit"],
        required : [false, "Please provide the company adddress"],
    },
    phone : {
        type: String,
        required : [true, "Please provide a phone number"]
    },
    authorizedPerson : {
        type : String,
        minlength : [3, "Authorized person name lenght can't be less than 3 character"],
        maxlength : [50,"Authorized person name length over (50) character limit"],
        required : [true, "Please provide the Authorized person name"],
    },
    agencyType : {
        type : Schema.Types.ObjectId,
        ref : "AgencyType"
    },
    market : {
        type : Schema.Types.ObjectId,
        ref : "Market"
    },
    agencyDiscountType : {
        type : String,
        enum : ['Flat Rate', 'Percentage'],
        default : 'Percentage'
    },
    agencyCode : {
        type:String,
        unique : [true, "Please try again"]
    },
    role : {
        type : String,
    },

    createdAt : {
        type:Date,
        default : Date.now
    }
    
})

// AgencySchema.pre("find", function(){
//     return this.populate("AgencyType")
// })

AgencySchema.pre("save", function(next){
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(this.password, salt, (err,hash)=>{
            this.password = hash;
            next();
        })
    })    
})

AgencySchema.pre("save", function(next){
    this.agencyCode = "MCA-" + cryptoRandomString({length: 6, type: 'numeric'});
    next();
})

AgencySchema.methods.generateJwtFromAgency = function(){
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;

    const payload = {
        _id : this._id,
        agencyCode : this.agencyCode,
        email : this.email,
        companyName : this.companyName,
        authorizedPerson : this.authorizedPerson,
        agencyType : this.agencyType
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY,{expiresIn:JWT_EXPIRE})
    return token;
}
module.exports = mongoose.model("Agency", AgencySchema)