const mongoose = require("mongoose");



const connectDatabase = ()=>{
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex:true})
    .then(()=>{
        console.log("MongoDB Connection is Succesfull");
    })
    .catch(err=>{
        console.error(err);
    })

}


module.exports = connectDatabase;