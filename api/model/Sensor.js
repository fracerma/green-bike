const mongoose= require("mongoose");

const Position= new mongoose.Schema({
    lat: Number,
    long: Number
})
const sensorSchema= new mongoose.Schema({
    userId:{
        type:String
    },
    type:{
        type:Number
    },
    lastPositions:{
        type: [Position]
    }
});