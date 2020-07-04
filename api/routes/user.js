const router=require("express").Router();
const User= require("../model/User");


router.get("/",async (req,res)=>{
    let user=(await User.findOne({_id: req.user.id})).toJSON();
    delete user.password; 
    res.json(user);
});

router.get("/:id",async (req,res)=>{
    let user=(await User.findOne({_id: req.params.id})).toJSON();
    delete user.password; 
    delete user.ecocredits; 
    res.json(user);
});


async function addEcoCredits(userId,kmDone){
    const user= await User.findById(userId);
    if(user.role==="premium"){
        user.ecocredits+=kmDone*ECO_EACH_KM;
        user.save();
        return true;
    }
    else return false
}

module.exports.addEcocredits;
module.exports.router=router;