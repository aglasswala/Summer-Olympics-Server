const mongoose = require('mongoose');
const validator = require('validator')
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
        validate: [validator.isEmail, 'invalid Email']
    },
    phoneNumber: {
        validate: [validator.isMobilePhone, 'invalid number']
    },
    age: {
        type: Number,
        required: true,
    },
    userType: {
        type: String,
        required: true
    },
    representingCountry: String,
    registeredEvents: [String],
    tickets: [String],
})

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}

