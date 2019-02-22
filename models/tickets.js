const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ticket = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    time: Date,
    cost: Number,
    sport: String
})

module.exports = {
    Ticket
}