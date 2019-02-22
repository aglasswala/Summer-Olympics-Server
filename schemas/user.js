const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    age: String,
    phone: Number,
    country: String,
    events: Array,
    birthday: Date,
    ticketPurchased: Date,
    tickets: Array,
})

module.export = {
    User
}