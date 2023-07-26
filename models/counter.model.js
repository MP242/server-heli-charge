const mongoose = require('mongoose');
const { Schema } = mongoose;

const counterSchema = new Schema({
    userID:{
        type: String,
        required: true
    },
    counterSession:{
        type: Map,
        of: Number
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

const Counter = mongoose.model('counter', counterSchema);

module.exports = Counter;
