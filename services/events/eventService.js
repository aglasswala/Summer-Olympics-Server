const ticketService = require('../ticket/ticketService')
const mongoose = require('mongoose')
const Event = require('../../models/events')

module.exports = {
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
            Event
                .find()
                .exec()
                .then(docs => {
                    return resolve(docs)
                })
                .catch(err => {
                    return reject(err);
                })
        })
    },
    getEvent: (eventId) => {
        return new Promise((resolve, reject) => {
            Event
                .find({
                    _id: eventId
                })
                .exec()
                .then(docs => {
                    return resolve(docs)
                })
                .catch(err => {
                    return reject(err);
                })
        })
    },
    createEvent: (nameOfEvent, time, athletes, type, userId) => {
        return new Promise((resolve, reject) => {
            const newEvent = new Event({
                _id: mongoose.Types.ObjectId(),
                nameOfEvent: nameOfEvent,
                time: time,
                registeredTickets: [],
                numberOfAttendees: 0,
                athletes: athletes,
                results: [],
                type: type,
                createdBy: userId
            })
            newEvent
                .save()
                .then(result => {
                    return resolve(result)
                })
                .catch(err => {
                    return reject(err);
                })
        })
    }
}