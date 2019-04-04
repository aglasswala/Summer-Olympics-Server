const ticketService = require('../ticket/ticketService')
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
    createCompetitionEvent: (nameOfEvent, time, stadium, location, date, registeredAthletes, createdBy) => {
        return new Promise((resolve, reject) => {
            const compEvent = {
                _id: uuidv1(),
                name: nameOfEvent,
                registeredTickets: 0,
                athletes: registeredAthletes,
                time: time,
                date: date,
                stadium: stadium,
                location,
                type: "competition",
                createdBy: createdBy
            }
            ticketService.db.events.push(compEvent)
            return resolve(ticketService.db.events)
        })
    }
}