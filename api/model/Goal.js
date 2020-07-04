const mongoose= require("mongoose");

const goalSchema= new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    //MENSILE-settimanale
    dateType: {
        type: String,
        required: true
    },
    //KM
    value: {
        type: Number,
        required: true
    },
    created:{
        type: Date,
        default: Date.now()
    },
    expires:{
        type: Date,
        required: true
    },
    status:{
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Goal', goalSchema)