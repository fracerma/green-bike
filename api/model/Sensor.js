const mongoose= require("mongoose");

const Position= new mongoose.Schema({
    lat: Number,
    long: Number
})
const sensorSchema= new mongoose.Schema({
    entityId: String,
    userId:{
        type:String
    },
    type:{
        type:Number
    },
    lastLat:{
        type: Number,
        default: 0.00000001
        },
    lastLon: {
        type: Number,
        default: 0.00000001
    },
    numMeasures:{
        type: Number,
        default:0
    }
});

module.exports=mongoose.model("Sensor",sensorSchema);