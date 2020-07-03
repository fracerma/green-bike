const router=require("express").Router();
const Sensor=require("../model/Sensor");
const Measure=require("../model/Measure");

//TODO validation
router.post("/",async (req,res)=>{
    const exists=await Sensor.findOne({entityId:req.body.entityId});
    if(exists)return res.sendStatus(400);
    const sensor=new Sensor(req.body);
    await sensor.save()
    res.json(sensor);
});


router.get("/",async (req,res)=>{
    res.json(await Sensor.find({}));
});
//TODO validation and blockchain check
router.post("/:sensor",async (req,res)=>{
    try{
        const sensor=await Sensor.findOne({entityId: req.params.sensor});
        console.log(sensor);
        if(!sensor) return res.sendStatus(404);
        const pollu=checkType(sensor.type,req.body.pollutants);
        if(!pollu) return res.sendStatus(400);
        const mesure=new Measure(req.body);
        mesure.sensorId=sensor.id;
        mesure.pollutants=pollu;
        await mesure.save();

        sensor.lastLat=req.body.lat;
        sensor.lastLon=req.body.lon;
        if(sensor.numMeasures%20==0) checkBlockchain();
        sensor.numMeasures+=1;
        await sensor.save();
        
        res.json(mesure);
    }catch(err){
        console.error(err);
        res.sendStatus(400);
    }
})

//TODO
function checkBlockchain(){

}

function checkType(type,pollutants){
    const polType=["PM10","PM2_5","NO2","O3","SO2","CO"]
    let ok=true;
    let pow=0;
    let obj={};
    for(exp=0;exp<6;exp++){
        pow=Math.pow(2, exp)
        if(pow>type) break;
        if((type&pow)===pow){
          if(!pollutants.hasOwnProperty(polType[exp])){
            ok=false;
            break;
          }
          else{
            if(typeof pollutants[polType[exp]] === 'string' || pollutants[polType[exp]] instanceof String)
                obj[polType[exp]]=parseFloat(pollutants[polType[exp]].includes(",")?pollutants[polType[exp]].replace(",","."):pollutants[polType[exp]]);
            else obj[polType[exp]]=pollutants[polType[exp]];
          }
        }
    }
    return ok?obj:null;
}
module.exports= router;