
const BookingModel = require("../models/booking")
const BaseService = require("./baseservice")


class BookingService extends BaseService {
    model = BookingModel 

    async findToday(options){
        return this.model.find(options.filter).populate(options.populate).sort( { "createdAt": -1 } );
    }

    async aggregate(options){
        return this.model.aggregate(options).sort( { "createdAt": -1 } );
    }
    
}

module.exports = new BookingService();