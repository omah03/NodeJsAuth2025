const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: v => v ? v.toLowerCase() : v,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)