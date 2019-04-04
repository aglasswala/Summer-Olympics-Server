const ticketService = require('../ticket/ticketService')
const uuidv1 = require('uuid/v1');

module.exports = {
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
            const compEvents = ticketService.db.events.filter(event => event.type === "competition")
            const awardEvents = ticketService.db.events.filter(event => event.type === "awardCeremony")
            const autoEvents = ticketService.db.events.filter(event => event.type === "autographs")

            const allEvents = ticketService.db.events
            const result = {
                compEvents,
                awardEvents,
                autoEvents,
                allEvents
            }
            return resolve(result);
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
            return resolve(compEvent)
        })
    }
}