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
          let allEvents = {}
          return db('ceremonyevents')
            .select('*')
            .where('ceremonyevents.firstplace', '=', userid)
            .orWhere('ceremonyevents.secondplace', '=', userid)
            .orWhere('ceremonyevents.thirdplace', '=', userid)
            .join('competitionevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
            .then(ceremonyEvents => {
              allEvents.ceremonyEvents = ceremonyEvents
              allEvents.result = result
              return allEvents
            })
            .catch(err => console.log(err))
        })
        .then(result => {
          return resolve(result)
        })
        .catch(err => {
          return reject(err)
        })
      })
    },
    getCompEvents: () => {
      return new Promise((resolve, reject) => {
        db.select('*').from('competitionevents')
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
    },
    getCereEvents: () => {
      return new Promise((resolve, reject) => {
        db.select('*').from('ceremonyevents')
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
    },
    getAutographEvents: () => {
      return new Promise((resolve, reject) => {
        db('autographevents')
          .select('*')
          .join('users', 'users.userid', '=', 'autographevents.userid')
          .then(result => resolve(result))
          .catch(err => reject(err))
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
              const athleteNotifications = filteredRegisteredAthletes.map(athlete => ({
                eventid: eventid,
                userid: athlete,
                body: "You're registered for a new event"
              }))
              return db('notifications')
                      .insert(athleteNotifications)
                      .then(() => {
                        return db('registeredathletes')
                                .insert(fieldsToInsert)
                                .then(() => {
                                  return eventid
                                })
                      })
            })
            .then((eventid) => {
              return db.select('*').from('users')
                      .then(users => {
                        return {
                          users,
                          eventid
                        }
                      })
            })
            .then(result => {
              const notifications = result.users.map(user => ({
                userid: user.userid,
                eventid: result.eventid,
                body: "Check out the new event"
              }))
              return db('notifications')
                      .insert(notifications)
            })
            .then(response => resolve(response))
            .catch(err => reject(err))
        })
    },
    createCeremonyEvent: (eventid, firstPlace, secondPlace, thirdPlace, newTime, newDate, venue, createdBy) => {
      return new Promise((resolve, reject) => {
        db('ceremonyevents')
          .insert({
            eventid: eventid,
            firstplace: firstPlace,
            secondplace: secondPlace,
            thirdplace: thirdPlace,
            time: newTime,
            date: newDate,
            venue: venue,
            createdby: createdBy
          })
          .then(result => {
            return db.select('*').from('users')
          })
          .then(users => {
            const notifications = users.map(user => ({
              userid: user.userid,
              eventid: eventid,
              body: "Check out who placed"
            }))
            return db('notifications')
                    .insert(notifications)
          })
          .then(response => resolve(response))
          .catch(err => reject(err))
      })
    },
    createAutographEvent: (athleteUserId, newTime, venue, newDate) => {
      return new Promise((resolve, reject) => {
        db('autographevents')
          .insert({
            userid: athleteUserId,
            date: newDate,
            time: newTime,
            venue: venue
          })
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
    },
    deleteEvent: (eventid, userid) => {
      return new Promise((resolve, reject) => {
        db('registeredathletes')
          .select('*')
          .where('eventid', eventid)
          .del()
          .then(result => {
            return db('tickets')
                    .select('*')
                    .where('eventid', eventid)
                    .del()
                    .catch(err => console.log(err))
          })
          .then(result => {
            return db('ceremonyevents')
                    .select('*')
                    .where('eventid', eventid)
                    .del()
                    .catch(err => console.log(err))
          })
          .then(result => {
            return db('notifications')
                    .select('*')
                    .where('eventid', eventid)
                    .del()
                    .catch(err => console.log(err))
          })
          .then(result => {
            return db('competitionevents')
                    .select('*')
                    .where('eventid', eventid)
                    .del()
                    .catch(err => console.log(err))
          })
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
    },
    // Notification for autograph doesn't work because the eventid in the notification table is tied to a competition event 
    // not a autograph event. 
    deleteAutographEvents: (eventid, userid) => {
      return new Promise((resolve, reject) => {
        db('autographevents')
          .select('*')
          .where('autographeventsid', eventid)
          .del()
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
    }
}