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
          let compEvent = []
          let ceremonyEvents = [] 
          db.select('sportname', 'date', 'time', 'venue').from('competitionevents')
            .then(allCompEvents => {
              compEvent = allCompEvents
              return db('competitionevents')
                      .join('ceremonyevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
                      .select('sportname', 'ceremonyevents.time', 'ceremonyevents.date', 'ceremonyevents.venue')
            })
            .then(ceremEvents => {
              ceremonyEvents = ceremEvents
              const autoEvents = ticketService.db.events.filter(event => event.type === "autographs")

              const allEvents = ticketService.db.events
              const result = {
                  compEvent,
                  ceremonyEvents,
                  autoEvents,
                  allEvents
              }
              return resolve(result);
            })
            .catch(err => reject(err))
        })
    },
    getAthleteEvents: (userid) => {
      return new Promise((resolve, reject) => {
        db('registeredathletes')
        .join('competitionevents', 'competitionevents.eventid', '=', 'registeredathletes.eventid')
        .select('*')
        .then(result => {
          return resolve(result)
        })
        .catch(err => reject(err))
      })
    },
    getCompetitionEvent: (eventId) => {
        return new Promise((resolve, reject) => {
            db('competitionevents')
              .join('ceremonyevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
              .select('sportname', 'ceremonyevents.time', 'ceremonyevents.date', 'ceremonyevents.venue')
                .then(data => {
                  return resolve(data[0])
                })
                .catch(err => reject(err));
        })
    },
    createCompetitionEvent: (nameOfEvent, time, stadium, location, date, registeredAthletes, createdBy) => {
        return new Promise((resolve, reject) => {
          const dateString = Date(date).toString();
            const compEvent = {
                _id: uuidv1(),
                name: nameOfEvent,
                registeredTickets: [],
                athletes: registeredAthletes,
                time: time,
                date: dateString,
                stadium: stadium,
                location,
                type: "competition",
                createdBy: createdBy
            }
            ticketService.db.events.push(compEvent)
            return resolve(compEvent)
        })
    },
}