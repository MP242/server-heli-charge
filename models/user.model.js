const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin : {
        type: Boolean
    },
    created_at:{
        type: Date,
        default: Date.now,
    },
    updated_at:{
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
