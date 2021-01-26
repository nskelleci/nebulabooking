const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentRequest = new Schema({
    booking: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Booking"
    },
    description: {
        type: String,
        trim: true,
        maxlength: [100, 'Description can not be more than 100 characters']
    },
    paymenType: {
        type: String,
        enum: ['Credit Card', 'Bank Transfer'],
    },
    amount: {
        type: Number,
        trim: true,
        maxlength: [11, 'Amount can not be more than 11 characters']
    },
    status: {
        type: String,
        enum: ['Pending Review', 'Confirmed', 'Rejected'],
    }

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("PaymentRequest", PaymentRequest)