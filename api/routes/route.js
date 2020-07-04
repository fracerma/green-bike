const router=require("express").Router();
const buildUrl=require("build-url");
const axios = require("axios");
const getBestMeasure=require("./airQuality").getBestMeasure;

router.get("/",async (req,res)=>{
    try{
        let response;
        const responseBike= (await axios.get(buildUrlMode("bicycling",req.query.origin,req.query.destination))).data;
        if(responseBike.status==="ZERO_RESULTS"){
            const responseWalk=(await axios.get(buildUrlMode("walking",req.query.origin,req.query.destination))).data;
            if(responseWalk.status==="ZERO_RESULTS"){
                const responseDrive=(await axios.get(buildUrlMode("driving",req.query.origin,req.query.destination))).data;
                if(responseWalk.status==="ZERO_RESULTS") response=responseWalk;
                else response=responseDrive;
            }
            else response=responseWalk;
        }
        else response=responseBike;
        console.log(response);
        if(response.routes.length>0){
            let faster={index:-1,value:Number.MAX_SAFE_INTEGER};
            let healthier={index:-1,value:Number.MAX_SAFE_INTEGER};
            let shorter={index:-1,value:Number.MAX_SAFE_INTEGER};
            for(j=0;j<response.routes.length;j++){
                let route=response.routes[j];
                let leng=0;
                let accumulator=0;
                
                for(i=0;i<route.legs[0].steps.length;i++){
                    currentValue=route.legs[0].steps[i];
                    const point=(await getBestMeasure(currentValue.end_location.lat,currentValue.end_location.lng));
                    let value=0;
                    if(point!==null){
                        value=point.IQAValue;
                        leng++;
                    }
                    accumulator+=value;
                }
                route.IQARoute=accumulator/leng;
                if(route.IQARoute<healthier.value){
                    healthier.value=route.IQARoute;
                    healthier.index=j;
                }
                if(route.legs[0].distance.value<shorter.value){
                    shorter.value=route.legs[0].distance.value;
                    shorter.index=j;
                }
                if(route.legs[0].duration.value<faster.value){
                    faster.value=route.legs[0].duration.value;
                    faster.index=j;
                }
                console.log(route.legs[0].steps.length,leng, route.IQARoute);
                response.routes[j]=route;
            }
            response.healthier=healthier.index;
            response.faster=faster.index;
            response.shorter=shorter.index;
            res.json(response);
        }else res.sendStatus(404);
        
    }
    catch(err){
        console.error(err);
        res.sendStatus(400);
    }
    
});

function buildUrlMode(mode,origin,destination){
    return buildUrl("https://maps.googleapis.com/maps/api/directions/json",{
        queryParams: {
            key:process.env.GOOGLE_API_KEY,
            alternatives: true,
            mode:mode,
            origin: origin,
            destination: destination
        }
    });
}

module.exports=router;