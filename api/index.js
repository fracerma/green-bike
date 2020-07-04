const express= require("express");
const axios = require("axios");
const mongoose=require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true,useUnifiedTopology: true },()=>
    console.log("Connected to db")
);

const app= express();
require("dotenv").config();

app.use(express.json());
app.get("/",(req,res)=>{
    res.send("ciao");
})
app.use(verifyToken);

const userRoute=require("./routes/user").router;
const sensorRoute=require("./routes/sensor");
const airQualRoute=require("./routes/airQuality").router;
const routeFindRoute=require("./routes/route");
const journeyRoute=require("./routes/journey");
const goalRoute=require("./routes/goal");
app.use("/users",userRoute);
app.use("/sensor",sensorRoute);
app.use("/airquality",airQualRoute);
app.use("/route",routeFindRoute);
app.use("/journey",journeyRoute);
app.use("/goal",goalRoute);

async function verifyToken(req,res,next){
    const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if(!token) return res.sendStatus(401);
    try{
        const response=await axios.get(`${process.env.BASE_URL}:4500/verify?token=${token}`);
        req.user=response.data;
        next();
    }catch(err){
        console.error(err);
        res.sendStatus(401);
    }
}

const port= process.env.PORT || 4000;
app.listen(port,()=>console.log("Api is listening on "+process.env.BASE_URL+":"+port));
