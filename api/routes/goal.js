const router= require("express").Router();
const Goal=require("../model/Goal");
const User = require("../model/User");
router.get("/",async(req,res)=>{
    res.json(await Goal.find({userId:req.user.id}));
});
router.get("/done",async (req,res)=>{
    res.json(await Goal.find({userId:req.user.id,status:true}));
});
router.get("/failed",async (req,res)=>{
    res.json(await Goal.find({userId:req.user.id,status:false, expires:{ $lt:Date.now()}}));
});
router.post("/",async(req,res)=>{
    let expires;
    if(req.body.dateType==="month"){
        let now=new Date();
        expires=now.setMonth(now.getMonth()+1);
    }
    else if(req.body.dateType==="week"){
        let now=new Date();
        expires=now.setDate(now.getDate()+7);
    }
    console.log(req.body);
    
    const goal= new Goal({
        userId: req.user.id,
        dateType: req.body.dateType,
        value: req.body.value,
        expires: expires,
    });
    await goal.save()
    res.json(goal);
});

router.post("/:goalId",async (req,res)=>{
    const goal=await Goal.findOne({_id: req.params.goalId,userId: req.user.id});
    if(!goal) return res.sendStatus(400);
    const now=new Date();
    const user=await User.findById(goal.userId);
    console.log(user);
    console.log(goal);
    
    if((goal.dateType==="month"&&new Date(goal.expires)>=now&&user.kmMonth>=goal.value)||(goal.dateType==="week"&&goal.expires>=now&&user.kmWeek>=goal.value)){
        goal.status=true;
        await goal.save();
        res.json(goal);
    }
    else{
        res.status(400).send("Not yet");
    }

});

router.delete("/:goalId",async (req,res)=>{
    const goal=await Goal.findOne({_id: req.params.goalId,userId: req.user.id});
    if(!goal) return res.sendStatus(400);
    await Goal.deleteOne({_id:req.params.goalId});
    res.sendStatus(204);
});

module.exports=router;