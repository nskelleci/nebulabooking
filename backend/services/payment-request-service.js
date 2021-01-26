const PaymentRequest = require("../models/paymentRequest")
const BaseService = require("./baseservice")


class CabinCategoryService extends BaseService {
    model = PaymentRequest 
}

module.exports = new CabinCategoryService();