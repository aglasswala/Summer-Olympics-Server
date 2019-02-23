const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    numberOfAttendees: Number,
    sport: String,
    athletes: Array,
    results: String,
    type: String,
    createdBy: User
})

module.exports = {
    Event
}