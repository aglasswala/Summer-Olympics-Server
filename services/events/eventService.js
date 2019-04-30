const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1234',
    database: 'postgres',
  },
});

const combineFirstandLast = (events) => {
  const eachEvent = [];
  events.map(event => (
    eachEvent.push({
      sportname: `${event.fname} ${event.lname}`,
      time: event.time,
      date: event.date,
      venue: event.venue,
    })
  ));
  return eachEvent;
};

module.exports = {
  getAllEvents: () => new Promise((resolve, reject) => {
    let compEvent = [];
    let ceremonyEvents = [];
    let autoEvents = [];
    db.select('sportname', 'date', 'time', 'venue')
      .from('competitionevents')
      .then((allCompEvents) => {
        compEvent = allCompEvents;
        return db('competitionevents')
          .join('ceremonyevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
          .select(
            'sportname',
            'ceremonyevents.time',
            'ceremonyevents.date',
            'ceremonyevents.venue',
          );
      })
      .then((ceremEvents) => {
        ceremonyEvents = ceremEvents;
        return db('autographevents')
          .join('users', 'autographevents.userid', '=', 'users.userid')
          .select(
            'users.fname',
            'users.lname',
            'autographevents.time',
            'autographevents.date',
            'autographevents.venue',
          );
      })
      .then((autoevents) => {
        autoEvents = combineFirstandLast(autoevents);
        const result = {
          compEvent,
          ceremonyEvents,
          autoEvents,
        };
        return resolve(result);
      })
      .catch(err => reject(err));
  }),
  getAthleteEvents: userid => new Promise((resolve, reject) => {
    db('registeredathletes')
      .select('*')
      .where('registeredathletes.userid', '=', userid)
      .join('competitionevents', 'competitionevents.eventid', '=', 'registeredathletes.eventid')
      .then((result) => {
        const allEvents = {};
        return db('ceremonyevents')
          .select('*')
          .where('ceremonyevents.firstplace', '=', userid)
          .orWhere('ceremonyevents.secondplace', '=', userid)
          .orWhere('ceremonyevents.thirdplace', '=', userid)
          .join('competitionevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
          .then((ceremonyEvents) => {
            allEvents.ceremonyEvents = ceremonyEvents;
            allEvents.result = result;
            return resolve(allEvents);
          })
          .catch(err => reject(err));
      })
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),
  getCompEvents: () => new Promise((resolve, reject) => {
    db.select('*')
      .from('competitionevents')
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),
  getCereEvents: () => new Promise((resolve, reject) => {
    db('ceremonyevents')
    .select('ceremonyid','competitionevents.sportname','ceremonyevents.time','ceremonyevents.date','ceremonyevents.venue') 
    .join('competitionevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
    .then(result => resolve(result))
    .catch(err => reject(err));
  }),
  getMedalists: () => new Promise((resolve, reject) => {
    let allAthletes = {}
    db('ceremonyevents')
      .select('competitionevents.sportname', 'ceremonyevents.firstplace', 'ceremonyevents.secondplace', 'ceremonyevents.thirdplace')
      .join('competitionevents', 'competitionevents.eventid', '=', 'ceremonyevents.eventid')
      .then(result => {
        allAthletes.cereEvents = result
        return db('users').select('fname', 'lname', 'userid')
      })
      .then(users => {
        allAthletes.users = users
        return resolve(allAthletes)
      })
      .catch(err => {
        return reject(err)
      })
  }),
  getAutographEvents: () => new Promise((resolve, reject) => {
    db('autographevents')
      .select('*')
      .join('users', 'users.userid', '=', 'autographevents.userid')
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),
  createCompetitionEvent: (
    sportname,
    newTime,
    venue,
    newDate,
    filteredRegisteredAthletes,
    createdBy,
  ) => new Promise((resolve, reject) => {
    db('competitionevents')
      .returning('eventid')
      .insert({
        sportname,
        time: newTime,
        date: newDate,
        venue,
        userid: createdBy,
      })
      .then((response) => {
        const eventid = response[0];
        const fieldsToInsert = filteredRegisteredAthletes.map(field => ({
          eventid,
          userid: field,
        }));
        const athleteNotifications = filteredRegisteredAthletes.map(athlete => ({
          eventid,
          userid: athlete,
          body: "You're registered for a new event",
        }));
        return db('notifications')
          .insert(athleteNotifications)
          .then(() => db('registeredathletes')
            .insert(fieldsToInsert)
            .then(() => eventid));
      })
      .then(eventid => db
        .select('*')
        .from('users')
        .then(users => ({
          users,
          eventid,
        })))
      .then((result) => {
        const notifications = result.users.map(user => ({
          userid: user.userid,
          eventid: result.eventid,
          body: 'Check out the new event',
        }));
        return db('notifications').insert(notifications);
      })
      .then(response => resolve(response))
      .catch(err => reject(err));
  }),
  createCeremonyEvent: (
    eventid,
    firstPlace,
    secondPlace,
    thirdPlace,
    newTime,
    newDate,
    venue,
    createdBy,
  ) => new Promise((resolve, reject) => {
    db('ceremonyevents')
      .insert({
        eventid,
        firstplace: firstPlace,
        secondplace: secondPlace,
        thirdplace: thirdPlace,
        time: newTime,
        date: newDate,
        venue,
        createdby: createdBy,
      })
      .then(response => resolve(response))
      .catch(err => reject(err));
  }),
  // eslint-disable-next-line
  createAutographEvent: (athleteUserId, newTime, venue, newDate) => new Promise((resolve, reject) => {
    db('autographevents')
      .insert({
        userid: athleteUserId,
        date: newDate,
        time: newTime,
        venue,
      })
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),
  deleteEvent: eventid => new Promise((resolve, reject) => {
    db('registeredathletes')
      .select('*')
      .where('eventid', eventid)
      .del()
      .then(() => db('tickets')
        .select('*')
        .where('eventid', eventid)
        .del()
        .catch(err => reject(err)))
      .then(() => db('ceremonyevents')
        .select('*')
        .where('eventid', eventid)
        .del()
        .catch(err => reject(err)))
      .then(() => db('notifications')
        .select('*')
        .where('eventid', eventid)
        .del()
        .catch(err => reject(err)))
      .then(() => db('competitionevents')
        .select('*')
        .where('eventid', eventid)
        .del()
        .catch(err => reject(err)))
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),
  // Notification for autograph doesn't work because the eventid in the
  // notification table is tied to a competition event
  // not a autograph event.
  deleteAutographEvents: eventid => new Promise((resolve, reject) => {
    db('autographevents')
      .select('*')
      .where('autographeventsid', eventid)
      .del()
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),

  deleteCeremonyEvents: eventid => new Promise((resolve, reject) => {
    db('ceremonyevents')
      .select('*')
      .where('ceremonyid', eventid)
      .del()
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),

  editEvent: updatedEvent => new Promise((resolve, reject) => {
    db('competitionevents')
      .where('eventid', updatedEvent.eventid)
      .select('*')
      .update({
        sportname: updatedEvent.sportname,
        venue: updatedEvent.venue,
        time: updatedEvent.time,
        date: updatedEvent.date,
      })
      .then(() => db('registeredathletes')
        .select('*')
        .where('eventid', updatedEvent.eventid))
      .then((athletes) => {
        const notifications = athletes.map(user => ({
          userid: user.userid,
          eventid: updatedEvent.eventid,
          body: 'Your event was updated',
        }));
        return db('notifications').insert(notifications);
      })
      .then(result => resolve(result))
      .catch(err => reject(err));
  }),
};
