const bcrypt = require('bcrypt');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  },
});

module.exports = {
  getUser: (email, password) => new Promise((resolve, reject) => {
    db.select('email', 'hash')
      .from('login')
      .where('email', '=', email)
      .then((data) => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return db
            .select('*')
            .from('users')
            .where('email', '=', email)
            .then(user => resolve(user[0]))
            .catch(err => reject(err));
        }
        return reject();
      })
      .catch(err => reject(err));
  }),
  getUserById: userId => new Promise((resolve, reject) => {
    db.select('*')
      .where('userid', userId)
      .from('users')
      .then(data => resolve(data[0]))
      .catch(err => reject(err));
  }),
  registerUser: (
    firstName,
    lastName,
    street,
    city,
    state,
    zip,
    email,
    phoneNumber,
    countryOfOrigin,
    password,
  ) => new Promise((resolve, reject) => {
    const hash = bcrypt.hashSync(password, 10);
    db.transaction((trx) => {
      trx
        .insert({
          hash,
          email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => trx('users')
          .returning('*')
          .insert({
            fname: firstName,
            lname: lastName,
            street,
            city,
            state,
            zip,
            email: loginEmail[0],
            phonenumber: phoneNumber,
            countryoforigin: countryOfOrigin,
            usertype: 2,
          }))
        .then(data => resolve(data[0]))
        .then(trx.commit)
        .catch(trx.rollback);
    })
      .catch(err => reject(err));
  }),
  getAthletes: () => new Promise((resolve, reject) => {
    db.select('*')
      .from('users')
      .where('usertype', '=', 2)
      .then(users => resolve(users))
      .catch(err => reject(err));
  }),
  getRegisteredAthletes: eventid => new Promise((resolve, reject) => {
    db('registeredathletes')
      .select('*')
      .where('eventid', eventid)
      .join('users', 'users.userid', '=', 'registeredathletes.userid')
      .then(response => resolve(response))
      .catch(err => reject(err));
  }),
  getNotifications: userid => new Promise((resolve, reject) => {
    db('notifications')
      .select('*')
      .where('notifications.userid', userid)
      .join('competitionevents', 'competitionevents.eventid', '=', 'notifications.eventid')
      .then(notification => resolve(notification))
      .catch(err => reject(err));
  }),
  deleteNotifications: id => new Promise((resolve, reject) => {
    db('notifications')
      .select('*')
      .where('notificationid', id)
      .del()
      .then(result => resolve(result))
      .catch(err => {
        console.log(err)
      });
  }),
};
