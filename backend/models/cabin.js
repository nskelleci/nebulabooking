const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CabinSchema = new Schema({
    number : {
        type : String,
        required :[true, "Please provide a Cabin Number"],
        
    },
    description : {
        type : String,
        required : false
    },
    capacity : {
        type : Number,
        required : [true,"Please enter a valid capacity"]
    },
    cabinCategory : {
        type : Schema.Types.ObjectId,
        ref : "CabinCategory",
        required : [true, "Please assign a Cabin Category"]
    },
    bedType :{
        type : Schema.Types.ObjectId,
        ref : "BedType",
        required : [true, "Please choose a Bed Type"]
    },
    vessel : {
        type : Schema.Types.ObjectId,
        ref : "Vessel",
        required : [true,"Please select a Vessel"]
    }
})

CabinSchema.pre('find', function(){
    this.populate(["bedType","cabinCategory"])
})

module.exports = mongoose.model("Cabin",CabinSchema)