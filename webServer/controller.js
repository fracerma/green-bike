const session = require("express-session");
const axios= require("axios");
const router = require("express").Router();


const sess = session({
    name: "sid_jwt",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: true,
    }
  });

  router.use(sess);

  const redirectFrontpage = (req, res, next) => {
    if (!req.session.refToken) {
      res.redirect("/frontpage.html");
    } else next();
  };
  router.get("/",redirectFrontpage);

  router.post("/login",async (req,res)=>{
    const response= axios.post(`${process.env.BASE_AUTH_URL}/login`,{
        email: req.body.email,
        password: req.body.password
    })
    .then(function (response) {
        req.session.token=response.data.accessToken;
        req.session.refToken=response.data.refreshToken;
        res.redirect("/");
    })
    .catch(function (error) {
        if(error.response.status=403){
            req.session.refToken=error.response.data.refreshToken;
            res.redirect("/");
        }
        else res.sendStatus(error.response.status);
    });
  });
  router.post("/register",async (req,res)=>{
    axios.post(`${process.env.BASE_AUTH_URL}/register`,{
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    }).then(resp=>{
        res.redirect("/");
    }).catch(err=>{
        console.error(err);
        
    })
    
  });

  router.get("/logout",(req,res)=>{
    axios.delete(`${process.env.BASE_AUTH_URL}/logout`,{
        token: req.session.refToken
    }).then(resp=>{
        req.session.destroy();
        res.clearCookie("sid_jwt");
        res.redirect("/");
    }).catch(err=>{
        res.sendStatus(err.response.status);
    })
  });
  
  router.get("/apikey",(req,res)=>{
      res.json({apiKey: process.env.GOOGLE_API_KEY})
  })

module.exports=router;