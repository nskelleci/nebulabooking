const mongoose = require('mongoose');
const cryptoRandomString = require('crypto-random-string');

const Schema = mongoose.Schema;


const BookingSchema = new Schema({
    refNo : {
        type : String
    },
    status : {
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
    },
    rosPrice : {
        type : Number
    },
    isRos : {
        type : Boolean
    },
    totalPrice : {
        type : Number
    },
    agencyCost : {
        type: Number
    },
    paidAmount : {
        type: Array
    },
    balance: {
        type: Number
    },
    profit: {
        type: Number
    },
    
},
{ 
    timestamps: true 
}
)

BookingSchema.pre("save", function(next){
    this.refNo = "BRN-" + cryptoRandomString({length: 6, type: 'numeric'});
    next();
})

// CruiseSchema.pre('find', function(){
//     this.populate("vessel")
// })
module.exports = mongoose.model("Booking", BookingSchema)