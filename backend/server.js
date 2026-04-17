require('dotenv').config()
const port= process.env.PORT
const mongoose = require("mongoose")
const express = require("express")
const medicalRoute = require("./routes/medical")
const { fetchOpenAlex } = require("./services/openAlexService");
const cors = require("cors")
const app = express()


// DNS Issue resolve
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const  DB =async()=>{
    try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("DATABASE CONNECTED");       
    }
    catch(err){
        console.log(err)  
    }
}
DB()

//middleware
app.use(express.json())
app.use(cors())


// routes
app.use("/med",medicalRoute)



// server
app.listen(port,()=>{
console.log(`SERVER LISTENING ON PORT ${port}`);
})