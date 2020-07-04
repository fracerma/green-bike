const router=require("express").Router();
const haversine= require("haversine-distance");
const axios = require("axios");
const Measure =require("../model/Measure")

const MAX_HOURS_DELAY=8;
const MAX_DISTANCE_MEASURE=300;

let lastMeasure=Date.now();

router.get("/",async (req,res)=>{
    if(!req.query.lat||!req.query.lon) return res.status(400).send("Missing lat ot lon params");
    
    try{
        res.json(await getBestMeasure(req.query.lat,req.query.lon,req.query.radius));
    }
    catch(err){
        console.error(err);
        res.sendStatus(400);
    }
    
});

//TODO remove all
router.get("/updateDate",(req,res)=>{
    const measures= Measure.find({});
    measures.forEach(el=> {
        el.creationTime=Date.now();
        el.save()
    });
});

async function getSensorMeasures(lat,lon,radius){
    const a= {lat: lat,lon: lon};
    let measures= await Measure.find({});
    measures=measures.filter((el)=>{
        const b= {lat: el.lat, lon: el.lon};
        return haversine(a,b)<=radius && getDifferenceInHours(Date.now(),el.creationTime)<MAX_HOURS_DELAY;
    });
    if(measures.length>0)
        measures=measures.reduce((prev, current)=> {
            const prevDist= haversine(a,{lat: prev.lat, lon: prev.lon});
            const currDist= haversine(a,{lat: current.lat, lon: current.lon});
            return (prevDist < currDist) ? prev : current
        });
    else measures=null;
    return measures;
}

async function getBestMeasure(lat,lon,radiusQuery){
    const radius= radiusQuery||MAX_DISTANCE_MEASURE; //default meters
    let now=Date.now();
    let apiMeasure=null;
    let sensorMeasure=await getSensorMeasures(lat,lon,radius);
    if(getDifferenceInSeconds(now,lastMeasure)>2){
        lastMeasure= now;
        try{
            apiMeasure= (await axios.get(`https://hackathon.tim.it/airquality/latest?latitude=${lat}&longitude=${lon}&apikey=${process.env.AIR_QUAL_KEY}`)).data;
        }catch(err){
            console.error(err);  
        }
    }
    let returnMeasure=null;
    if(apiMeasure&&sensorMeasure)
        returnMeasure=(apiMeasure.date>sensorMeasure.date)?apiMeasure:sensorMeasure;
    else
        returnMeasure=(apiMeasure)?apiMeasure:sensorMeasure;
    return returnMeasure;
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

  module.exports.router=router;
  module.exports.getBestMeasure=getBestMeasure;