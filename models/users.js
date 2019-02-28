const mongoose = require('mongoose');
const validateEmail = require('../validators/validators')
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "Email is required",
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    userType: {
        type: String
    },
    representingCountry: String,
    registeredEvents: {
        type: [String]
    },
    tickets: {
        type: [String],
    },
})


module.exports = mongoose.model('User', userSchema);


