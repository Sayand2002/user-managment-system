const mongoose = require("mongoose");

const User = mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone_no:{
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type: String,
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    }
})

const registeredUsers = mongoose.model("registeredUsers", User);

module.exports = registeredUsers;