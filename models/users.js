const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    address: String,
    email: String,
    phoneNumber: String,
    age: Number,
    userType: String,
    representingCountry: String,
    registeredEvents: [String],
    tickets: [String],
})

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}

