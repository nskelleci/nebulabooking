const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AgencyTypeSchema = new Schema({
    name : {
        type : String,
        required :[true, "Please provide a Agency Type name"]
    },
    discountType : {
        type : String,
        enum : ["Flat","Percentage"]

    },
    discountRate : {
        type : Number,
    }
})

module.exports = mongoose.model("AgencyType",AgencyTypeSchema)