const axios = require("axios");

const router=require("express").Router();

function notLogged(req,res,next){
    if(!req.session.refToken){
        res.sendStatus(400);
    }
    else next();
}

router.use("/",notLogged,async (req,res)=>{
    axios({
        method: req.method,
        url: process.env.BASE_API_URL+req.url,
        data: (req.body)?req.body:null,
        query: (req.query)?req.query:null,
        headers: { Authorization: `Bearer ${req.session.token}` }
      }).then(resp=>{
          res.send(resp.data);
      }).catch(async err=>{
          if(err.response.status===401){
              
              req.session.token=await refreshToken(req.session.refToken);
              
              axios({
                method: req.method,
                url: process.env.BASE_API_URL+req.url,
                data: (req.body)?req.body:null,
                query: (req.query)?req.query:null,
                headers: { Authorization: `Bearer ${req.session.token}` }
              }).then(resp2=>{
                  res.send(resp2.data);
              }).catch(err2=>{
                  console.error("error2");
              })
          }
          else console.error("error");
      })
    req.method
    
});

async function refreshToken(refToken){
    try{
        const response= await axios.post(`${process.env.BASE_AUTH_URL}/token`,{
            token: refToken
        });
        return response.data.accessToken
    }
    catch(err){
        console.error(err);
        return -1;
        
    }
}


module.exports=router;