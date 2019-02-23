const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    numberOfAttendees: Number,
    sport: String,
    athletes: Array,
    results: String,
    type: String,
    createdBy: String
})

const Event = mongoose.model('Event', eventSchema);

module.exports = {
    Event
}