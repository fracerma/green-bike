const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    ecocredits:{
        type: Number,
        default: 0
    },
    kmDone:{
        type:Number,
        default: 0
    },
    kmToday:{
        type:Number,
        default: 0
    },
    kmWeek:{
        type:Number,
        default: 0
    },
    kmMonth:{
        type:Number,
        default: 0
    },
    role: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports= mongoose.model('User',userSchema);