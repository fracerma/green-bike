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

module.exports=router;