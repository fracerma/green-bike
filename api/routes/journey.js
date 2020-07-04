const Journey= require("../model/Journey");
const router= require("express").Router();
const haversine= require("haversine-distance");
const User = require("../model/User");
const { update } = require("../model/User");
const TIMEOUT_CHECKING_MS=6000;
const MAX_TIME_UPDATE_MINUTES=3;
const MAX_KMS_DAY=40;
const MAX_SPEED=20;
router.get("/",async (req,res)=>{
    res.json(await Journey.find({userId:req.user.id,active:false}));
})

router.get("/current",async(req,res)=>{
    res.json(await Journey.findOne({userId:req.user.id,active:true}));
})

router.post("/",async(req,res)=>{
    const isActive=await Journey.findOne({userId:req.user.id,active:true});
    if(isActive) return res.status(400).send("User have another journey active");
    let positions=[];
    let startPos=req.body.origin;
    startPos.time=Date.now();
    positions.push(req.body.origin);
    const newJourney= new Journey({
        userId: req.user.id,
        origin: req.body.origin,
        destination: req.body.destination,
        positions: positions,
        lastUpdate: req.body.origin
    });
    await newJourney.save()
    addTimeout(newJourney.id,req.user.id);
    res.json(newJourney);
});
router.post("/:journeyId",async (req,res)=>{
    const journey= await Journey.findOne({userId: req.user.id,_id:req.params.journeyId, active:true});
    if(!journey) return res.sendStatus(400);
    req.body.position.time=Date.now();
    journey.positions.push(req.body.position);
    const warinings=await updateKM(req.user.id,req.body.position,journey.lastUpdate)
    journey.lastUpdate=req.body.position;
    await journey.save();
    let obj;
    if(haversine(journey.lastUpdate,journey.destination)<50){
        await finishJourney(journey,req.user.id);
        obj={
            lastUpdate: journey.lastUpdate,
            status: "arrived",
            warinings: warinings
        };
    }
    else{
        obj={
            lastUpdate: journey.lastUpdate,
            status: "travelling",
            warinings: warinings
        };
    }
    res.json(obj);
});

router.delete("/:journeyId",async (req,res)=>{
    const journey= await Journey.findOne({userId: req.user.id,_id:req.params.journeyId, active:true});
    if(!journey) return res.sendStatus(400);
    let warinings;
    if(req.body.position){
        req.body.position.time=Date.now();
        journey.positions.push(req.body.position);
        warinings=await updateKM(req.user.id,req.body.position,journey.lastUpdate)
        journey.lastUpdate=req.body.position;
        await journey.save();
    }
    await finishJourney(journey,req.user.id);
    const obj={
        lastUpdate: journey.lastUpdate,
        status: "arrived",
        warinings: warinings
    };
    res.json(obj);
});

function addTimeout(journeyId,userId){
    setTimeout(checkJourney,TIMEOUT_CHECKING_MS,journeyId,userId);
}

async function checkJourney(journeyId){
    const journey=await Journey.findById(journeyId);
    if(journey.active){
        if(getDifferenceInMinutes(journey.lastUpdate.time,Date.now())>MAX_TIME_UPDATE_MINUTES){
            console.log("No update from user, closed the journey");
            await finishJourney(journey,req.user.id);
            
        }
        else{
            console.log("ok");
            addTimeout(journeyId);
        }
    }
}

async function finishJourney(journey,userId){
    if(!journey) return;
    journey.active=false;
    journey.destination=journey.lastUpdate;
    await journey.save()
    //TODO add kilometers done
    // let totalMeters=0;
    // for(i=0;i<journey.positions.length-1;i++){
    //     totalMeters+=haversine({lat:journey.positions[i].lat,lon:journey.positions[i].lon},{lat:journey.positions[i+1].lat,lon:journey.positions[i+1].lon} );
    // }
    // const user=await User.findById(userId);
    // user.kmDone+=totalMeters/1000;
    await user.save();
}

async function updateKM(userId,from,to){
    const user = await User.findById(userId);
    const perc= haversine(from,to)*1000;
    const time= getDifferenceInMinutes(from.time,to.time)/60;
    let status={};
    if(perc/time>MAX_SPEED){
        status.max_speed_warning=true
        return status;
    }
    else if(user.kmToday===MAX_KMS_DAY) {
        status.max_kms_warning=true;
        return status;
    }
    else if(user.kmToday+perc>MAX_KMS_DAY){
        status.max_kms_warning=true;
        user.kmToday=MAX_KMS_DAY;
        await user.save();
        return status;
    }
    else{
        user.kmToday+=perc;
        user.kmDone+=perc;
        user.kmMonth+=perc;
        user.kmWeek+=perc;
        await user.save();
    }
}

function getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(new Date(date2) - new Date(date1));
    return diffInMs / (1000 * 60);
  }

  module.exports=router;