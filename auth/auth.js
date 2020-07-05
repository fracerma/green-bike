const jwt=require("jsonwebtoken");
const express=require("express");
const mongoose= require("mongoose");
const bcrypt= require("bcryptjs")
const app= express();
const Token= require("./model/Token");
const User = require("./model/User");
const { registerValidation , loginValidation } = require("./validator");
require("dotenv").config();

//Database connection
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true,useUnifiedTopology: true },()=>
    console.log("Connected to db")
);

app.use(express.json());

app.post("/register",async (req,res)=>{
    const {error}=registerValidation(req.body);
    if(error) return res.status(400).send(error);
    try{
        const emailExists= await User.findOne({email:req.body.email});
        if(emailExists) return res.status(400).send("Email exists");
    }catch(error){
        console.error(error);
        return res.sendStatus(400)
    }
    const salt= bcrypt.genSaltSync();
    const hashPass= bcrypt.hashSync(req.body.password,salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPass,
    });
    try{
        await user.save();
        res.json(user);
    }catch(error){
        console.error(error);
        res.sendStatus(400);
    }
});

app.delete("/logout",async (req,res)=>{
    const refreshToken= req.body.token;
    await Token.deleteOne({refreshToken:refreshToken})
    res.sendStatus(200);
});

app.post("/login",async (req,res)=>{

    const {error}= loginValidation(req.body);
    if(error) return res.status(400).send(error);
    try{
        const user= await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send("Email or password is wrong");
        const valid= bcrypt.compareSync(req.body.password,user.password);

        const found=await Token.findOne({userId: user.id});
        if(found) return res.status(403).send({refreshToken: found.refreshToken});

        const accessToken= generateAccessToken({id: user.id, name: user.name, email: user.email, role: user.role});
        const refreshToken = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role},process.env.REFRESH_TOKEN_SECRET);

        await (new Token({userId:user.id, refreshToken: refreshToken})).save();
        res.json({accessToken: accessToken,refreshToken: refreshToken});
    }catch(error){
        console.error(error);
        return res.sendStatus(400);
    }
});

app.post("/token",async (req,res)=>{
    const refreshToken= req.body.token;
    try{
        const found= await Token.findOne({refreshToken: refreshToken});
        if(!found) return res.sendStatus(403);
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
            if(err) res.sendStatus(403);
            if(found.userId!==user.id) return res.sendStatus(403);
            const accessToken= generateAccessToken({id: user.id, name: user.name, email: user.email, role: user.role});
            res.json({accessToken: accessToken})
        })
    }catch(error){
        console.error(error);
        res.sendStatus(400);
    }
})

app.get("/verify",(req,res)=>{
    const token=req.query.token;
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err) res.sendStatus(401);
        else res.send(user);
    });
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const port= process.env.PORT || 4500;
app.listen(port,()=>{
    console.log(`Auth server listening at http://localhost:${port}`);
})