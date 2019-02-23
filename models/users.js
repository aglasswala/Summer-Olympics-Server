const mongoose = require('mongoose');
const Schema = mongoose.Schema

const User = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    email: String, 
    age: Number,
    reprentingCountry: String,
    phoneNumber: String,
    userType: String,
    tickets: Array,
})

module.exports = {
    User
}

