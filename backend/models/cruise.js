const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ScheduleItemSchema = new Schema({
    date : {
        type : Date,
        required :[true, "Please provide a Date"]
    },
    port : {
        type : Schema.Types.ObjectId,
        required : [true, "Please provide a Port"],
        ref : "Port"
    },
    arrivalTime : {
        type : String
    },
    departureTime : {
        type: String
    }
})

const BlockedCabinSchema = new Schema({
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

const CruiseSchema = new Schema({
    name : {
        type : String
    },
    description : {
        type: String
    },
    schedule : [ScheduleItemSchema],
    checkInDate : {
        type : Date,
        required : [true,"Please enter Check-in Date"]
    },
    checkOutDate : {
        type : Date,
        required : [true,"Please enter Check-out Date"]
    },
    cruiseType : {
        type: Schema.Types.ObjectId,
        ref : "CruiseType"
    },
    season : {
        type: Schema.Types.ObjectId,
        ref : "Season"
    },
    vessel : {
        type : Schema.Types.ObjectId,
        ref : "Vessel"
    },
    blockedCabins : [BlockedCabinSchema]
})


CruiseSchema.pre('find', function(){
    this.populate(["vessel","cruiseType"])
})

module.exports = mongoose.model("Cruise", CruiseSchema)