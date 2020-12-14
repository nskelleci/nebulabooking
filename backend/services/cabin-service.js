const CabinModel = require("../models/cabin")
const BaseService = require("./baseservice")
const blockedCabinService = require("./blocked-cabin-service")


class CabinService extends BaseService {
    model = CabinModel 

    async findAvailableCabins(options){
        
        const blockCabins = []
        options.cruise.blockedCabins.forEach(element => {
            blockCabins.push(element.cabin)
        });
        return await this.model.find({_id : {$nin : blockCabins}, 'vessel' : options.cruise.vessel}).populate(options.populate)
    }

    async findAvailableCabinsByCabinCategory(options){
        let blockCabinsDocuments = []
        let blockedCabins =[]
        const cruise = options.cruise
        const blockCabinOptions = {
            filter :{cruise},
            populate : ["cruise", "cabin", "blockedFor"]
        }
        blockCabinsDocuments = await blockedCabinService.findAll(blockCabinOptions)
        console.log("cabin servise gelen blockcabin documents=======", blockCabinsDocuments)
        blockCabinsDocuments.forEach(element => {
            blockedCabins.push(element.cabin)
        });
        
        return await this.model.find({_id : {$nin : blockedCabins}, 'vessel' : options.cruise.vessel, 'cabinCategory' : options.cabinCategory }).populate(options.populate)
    }
}

module.exports = new CabinService();