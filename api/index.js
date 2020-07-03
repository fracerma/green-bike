const express= require("express");
const axios = require("axios");
const app= express();
require("dotenv").config();

app.use(express.json());
app.use(verifyToken);

const userRoute=require("./routes/user");
app.use("/users",userRoute);

async function verifyToken(req,res,next){
    const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if(!token) return res.sendStatus(401);
    try{
        const response=await axios.get("http://localhost:4500/verify?token="+token);
        req.user=response.data;
        next();
    }catch(err){
        console.error(err);
        res.sendStatus(400);
    }
}

const port= process.env.PORT || 4000;
app.listen(port,()=>console.log("Api is listening on http://localhost:4000"));
