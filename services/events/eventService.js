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

const combineFirstandLast = (events) => {
  let eachEvent = []
  events.map(event => {
    eachEvent.push({
      sportname: event.fname + " " + event.lname,
      time: event.time,
      date: event.date,
      venue: event.venue
    })
  })
  return eachEvent
}


module.exports = {
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
          let compEvent = []
          let ceremonyEvents = []
          let autoEvents = []
          db.select('sportname', 'date', 'time', 'venue').from('competitionevents')
            .then(allCompEvents => {
              compEvent = allCompEvents
              return db('competitionevents')
                      .join('ceremonyevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
                      .select('sportname', 'ceremonyevents.time', 'ceremonyevents.date', 'ceremonyevents.venue')
            })
            .then(ceremEvents => {
              ceremonyEvents = ceremEvents
              return db('autographevents')
                      .join('users', 'autographevents.userid', '=', 'users.userid')
                      .select('users.fname', 'users.lname', 'autographevents.time', 'autographevents.date', 'autographevents.venue')
            })
            .then(autoevents => {
              autoEvents = combineFirstandLast(autoevents)
              const result = {
                  compEvent,
                  ceremonyEvents,
                  autoEvents
              }
              return resolve(result);
            })
            .catch(err => {
              return reject(err)
            })
        })
    },
    getAthleteEvents: (userid) => {
      return new Promise((resolve, reject) => {
        db('registeredathletes')
        .select('*')
        .where('registeredathletes.userid', '=', userid)
        .join('competitionevents', 'competitionevents.eventid', '=', 'registeredathletes.eventid')
        .then(result => {
          return resolve(result)
        })
        .catch(err => {
          return reject(err)
        })
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
    createCompetitionEvent: (sportname, newTime, venue, newDate, filteredRegisteredAthletes, createdBy) => {
        return new Promise((resolve, reject) => {
          db('competitionevents')
            .returning('eventid')
            .insert({
              sportname: sportname,
              time: newTime,
              date: newDate,
              venue: venue,
              userid: createdBy
            })
            .then(response => {
              const eventid = response[0]
              const fieldsToInsert = filteredRegisteredAthletes.map(field => ({
                eventid: eventid,
                userid: field
              }))
              return db('registeredathletes')
                      .insert(fieldsToInsert)
            })
            .then(response => resolve(response))
            .catch(err => reject(err))
        })
    },
}