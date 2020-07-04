const mongoose= require("mongoose");

const journeySchema= new mongoose.Schema({
    userId: {
        type: String,
        required:true
    },
    origin: {
        type: {
            lat: Number,
            lon: Number
        },
        required: true
    },
    destination:{
        type: {
            lat: Number,
            lon: Number
        },
        required: true
    },
    positions:{
        type:[{
            lat: Number,
            lon: Number,
            time: Date
        }]
    },
    startTime:{
        type: Date,
        default: Date.now()
    },
    finishTime: {
        type: Date
    },
    lastUpdate:{
        type:{
            lat: Number,
            lon: Number,
            time: Date 
        }
    },
    active:{
        type: Boolean,
        default: true
    }
});

module.exports= mongoose.model('Journey',journeySchema);