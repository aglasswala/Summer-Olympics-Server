const ticketService = require('../ticket/ticketService')
const mongoose = require('mongoose')
const Event = require('../../models/events')
const uuidv1 = require('uuid/v1');

module.exports = {
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
            return resolve(ticketService.db.events);
        })
    },
    getEvent: (eventId) => {
        return new Promise((resolve, reject) => {
            const getID =  ticketService.db.events.find(events => events._id === eventId)
            return resolve(getID);
        })
    },
    createEvent: (nameOfEvent, time, athletes, type, userId) => {
        return new Promise((resolve, reject) => {
            const newEvent = {
                _id: uuid,
                nameOfEvent: nameOfEvent,
                time: time,
                registeredTickets: [],
                numberOfAttendees: 0,
                athletes: athletes,
                results: [],
                type: type,
                createdBy: userId
            }
            ticketService.db.events.push(newEvent);
            return resolve(newEvent); 
        })
            
    }
}