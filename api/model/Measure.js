const mongoose= require("mongoose");


const measureSchema= new mongoose.Schema({
    sensorId: String,
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    IQAValue: {
        type: Number,
        default: 0
    },
    pollutants:{
        CO: Number,
        SO2: Number,
        O3: Number,
        NO2: Number,
        PM1: Number,
        PM2_5: Number,
        PM10: Number
    },
    creationTime: {
        type: Date,
        default: Date.now
    }

});

module.exports= mongoose.model('Measure',measureSchema);