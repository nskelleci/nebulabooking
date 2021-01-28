const mongoose = require("mongoose");



const connectDatabase = () => {
    let DB_URI = ''
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        DB_URI = process.env.MONGO_URI_DEV
    } else {
        DB_URI = process.env.MONGO_URI_PROD
    }

    mongoose.connect(DB_URI, { useNewUrlParser: true, useCreateIndex: true, userFindandModify: false, useUnifiedTopology: true })
        .then(() => {
            console.log("MongoDB Connection is Succesfull");
        })
        .catch(err => {
            console.error(err);
        })

}


module.exports = connectDatabase;