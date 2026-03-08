const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String, 
        default: 'user'
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
});

module.exports = mongoose.model('User', Userschema);