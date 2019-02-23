const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    time: Date,
    cost: Number,
    sport: String,
    owner: String
})

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = {
    Ticket
}