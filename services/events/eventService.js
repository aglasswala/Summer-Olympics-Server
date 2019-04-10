const ticketService = require('../ticket/ticketService')
const knex = require('knex');
const uuidv1 = require('uuid/v1');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1234',
    database: 'postgres'
  }
})


module.exports = {
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
            let compEvents = []
            db.select('*').from('competitionevents')
                .then(compEvents => {
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
                .catch(err => reject(err))
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
                registeredTickets: [],
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