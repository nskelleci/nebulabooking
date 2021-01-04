
const PriceModel = require("../models/price")
const BaseService = require("./baseservice")


class PriceService extends BaseService {
    model = PriceModel 
}

module.exports = new PriceService();