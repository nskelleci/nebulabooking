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

const RosCabinSchema = new Schema({
   
    cabin : {
        type : Schema.Types.ObjectId,
        required : [true, "Please provide a cabin"],
        ref : "Cabin"
    },
    rosPrice : {
        type : Number,
        required : [true, 'Please provide ros price']
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
    rosCabins:[RosCabinSchema]
})



CruiseSchema.pre('find', function(){
    this.populate(["vessel","cruiseType","port","cabin"])
})

RosCabinSchema.pre('find', function(){
    this.populate()
})



module.exports = mongoose.model("Cruise", CruiseSchema)