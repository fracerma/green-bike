const router=require("express").Router();
const mongoose=require("mongoose");
const User= require("../model/User");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_USER_URL,{ useNewUrlParser: true,useUnifiedTopology: true },()=>
    console.log("Connected to user db")
);

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