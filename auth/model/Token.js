const mongoose= require("mongoose");

const tokenSchema= new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    refreshToken:{
        type: String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports= mongoose.model('Token',tokenSchema);