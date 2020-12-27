const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv')
const express = require('express');
const connectDatabase = require('./Helpers/Database/connect-database');
const routers = require("./routes/main-router");
const customErrorHandler = require("./middlewares/errors/custom-error-handler");
const moment = require("moment")

//Enviroment variables
dotenv.config({
    path : "./config/env/config.env"
})

// MongoDB Connection
connectDatabase();

const PORT = process.env.PORT;


const app = express();
//app.use(moment);
app.use(morgan('combined'))
app.use(bodyParser.json())

//CORS 

var whitelist = ['http://localhost:8080', 'https://nebula-booking-vue.herokuapp.com', '5.182.247.156']

app.use(cors({
    origin : whitelist[0],
    credentials : true,
}))



//ROUTES MIDDLEWARE
app.use("/api/v1",routers)
//ROUTES END

//Error Handler
app.use(customErrorHandler)


app.get('/',(req,res)=>{
    res.send({
        message:'hello world'
    })
})


app.listen(PORT, ()=>{
    console.log(`App Started on : ${PORT} : ${process.env.NODE_ENV}`)
});