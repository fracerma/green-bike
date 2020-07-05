const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
////////////////////////////////////////
const PORT=process.env.PORT || 5000;

//////////////////////////////////////////

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const controller = require("./controller");
const api = require("./api");

app.use("/", controller);
app.use("/api", api);

app.use("/", express.static(__dirname + "/client/"));

app.listen(PORT,()=>{console.log("Web server is listening on port "+PORT)});
 
  