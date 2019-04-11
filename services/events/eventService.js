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
            let awardEvents = []
            db.select('*').from('competitionevents')
                .then(data => {
                    compEvents = data
                })
                .then(() => {
                    return db.select('*').from('ceremonyevents')
                })
                .then(ceremonyEvents => {
                    awardEvents = ceremonyEvents
                })
                .then(() => {
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
    getCompetitionEvent: (eventId) => {
        return new Promise((resolve, reject) => {
            db.select('*').where('eventid', '=', eventId).from('competitionevents')
                .then(data => resolve(data[0]))
                .catch(err => reject(err))
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