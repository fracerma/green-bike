const router=require("express").Router();
const haversine= require("haversine-distance");
const axios = require("axios");
const Measure =require("../model/Measure")

const MAX_HOURS_DELAY=8;

let lastMeasure=new Date();

router.get("/",async (req,res)=>{
    if(!req.query.lat||!req.query.lon) return res.status(400).send("Missing lat ot long params");
    const radius= req.radius||50; //default meters
    let now=new Date();
    let apiMeasure=null;
    const sensorMeasure = await getSensorMeasures(req.query.lat,req.query.lon,radius);
    if(getDifferenceInSeconds(now,lastMeasure)>=1){
        try{
        apiMeasure= (await axios.get(`https://hackathon.tim.it/airquality/latest?latitude=${req.query.lat}&longitude=${req.query.lon}&apikey=${process.env.AIR_QUAL_KEY}`)).data;
        const obj={sensorId:"apiTim",lat: req.query.lat,lon: req.query.lon,IQAValue: apiMeasure.IQAValue,pollutants: apiMeasure.pollutants, date: new Date(apiMeasure.timestamp)}
        const dataExists=await Measure.findOne(obj)
        if(!dataExists){
            const newm= new Measure(obj);
            await newm.save();
        }
        }catch(err){
            console.error(err);  
        }
    }
    lastMeasure= now;
    res.json({sensorMeasure: sensorMeasure});
});

router.get("/valid",(req,res)=>{

});

async function getSensorMeasures(lat,lon,radius){
    const a= {lat: lat,lon: lon};
    // if(lastMeasure.setHours(lastMeasure.getHours()+1)<now){
    //     const sensorMeasure= axios("https://hackathon.tim.it/bcnotarization/data")
    let mesures= await Measure.find({});
    mesures=mesures.filter((el)=>{
        const b= {lat: el.lat, lon: el.lon};
        return haversine(a,b)<=radius && getDifferenceInHours(el.date,new Date())<MAX_HOURS_DELAY;
    })
    return mesures;
}


function getDifferenceInHours(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60);
  }
  
  function getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
  }
  
  function getDifferenceInSeconds(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / 1000;
  }

  module.exports=router;