const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlockedCabinSchema = new Schema({
    cruise :{
        type : Schema.Types.ObjectId,
        required : true,
        ref : "Cruise"
    },
    cabin : {
        type: Schema.Types.ObjectId,
        required : [true, "Please provide a cabin"],
        ref : "Cabin"
    },
    blockedFor : {
        type:Schema.Types.ObjectId,
        ref : "Agency",
        required : [true, "Please provide a Agency"]
    },
    blockReason : {
        type : String,
        enum : ['Sold', 'Payment Pending', 'Reserved'],
    },
    blockedUntil : {
        type : Date,
        required : [false, "Provide a date"]
    }

})

module.exports = mongoose.model("BlockedCabin",BlockedCabinSchema)