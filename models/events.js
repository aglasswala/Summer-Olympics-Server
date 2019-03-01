const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nameOfEvent: {
        type: String,
        required: true,
    },
    registeredTicketIds: {
        type: [String]
    },
    time: Date,
    numberOfAttendees: Number,
    athletes: [String],
    results: [String],
    type: String,
    createdBy: String
})

module.exports = mongoose.model('Event', eventSchema);