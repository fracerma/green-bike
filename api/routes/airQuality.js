const router=require("express").Router();
const haversine= require("haversine-distance");
const axios = require("axios");
require("dotenv").config();

router.get("/",async (req,res)=>{
    if(!req.query.lat||!req.query.long) return res.status(400).send("Missing lat ot long params");
    const radius= req.radius||50; //default meters
    const apiMeasure= await axios.get(`hackathon.tim.it/airquality/latest?latitude=${req.query.lat}&longitude=${req.query.long}`);
    const sensorMeasure = getSensorMeasure(req.lat,req.long,radius);
});