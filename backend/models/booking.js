const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const BookingSchema = new Schema({
    refNo : {
        type : String
    },
    agency : {
        type : Schema.Types.ObjectId,
        ref : "Agency"
    },
    cabin : {
        type : Schema.Types.ObjectId,
        ref : "Cabin"
    },
    Passengers : [{
        type : Schema.Types.ObjectId,
        ref : "Passenger"
    }],
    notes : {
        type: String
    },
    cruise : {
        type: Schema.Types.ObjectId,
        ref : "Cruise"
    }
})

BookingSchema.pre("save", function(next){
    this.refNo = "BRN-" + cryptoRandomString({length: 6, type: 'numeric'});
    next();
})

// CruiseSchema.pre('find', function(){
//     this.populate("vessel")
// })
module.exports = mongoose.model("Cruise", CruiseSchema)