module.exports =class Service {
async findAll() {
    return this.model.find()
}

async findAll(options={undefined}) {
    return this.model.find(options.filter).populate(options.populate).sort( { "createdAt": -1 } );
}

async findOneby(options={undefined}){
    return this.model.findOne(options.filter).populate(options.populate).select("+" + options.select).exec()
}

async add(item) {
    return this.model.create(item)
}

async update(id, item) {
    return this.model.findOneAndUpdate({"_id" : id }, item, {new : true})
}

async  del(itemId) {
    return this.model.deleteOne({ _id: itemId })
}

async find(itemId) {
    return this.model.findById(itemId)
}
}