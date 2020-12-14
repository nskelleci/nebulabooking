const BlockedCabin = require("../models/blockedCabin")
const BaseService = require("./baseservice")


class BlockedCabinService extends BaseService {
    model = BlockedCabin 
}

module.exports = new BlockedCabinService();