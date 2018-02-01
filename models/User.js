const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: string,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('users', UserSchema);