const ticketService = require('../ticket/ticketService');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v1');
const knex = require('knex');

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
    getUser: (email, password) => {
        return new Promise((resolve, reject) => {
            db.select('email', 'hash').from('login')
              .where('email', '=', email)
              .then(data => {
                const isValid = bcrypt.compareSync(password, data[0].hash)
                if(isValid) {
                  return db.select('*').from('users').where('email', '=', email)
                  .then(user => {
                    return resolve(user[0])
                  })
                  .catch(err => {
                    return reject(err)
                  })
                } else {
                  return reject()
                }
              })
        })
        .catch(err => {
            return reject(err)
        })
    },
    getUserById: (userId) => {
        return new Promise((resolve, reject) => {
            db.select("*").where('userid', userId).from('users')
            .then(data => {
              return resolve(data[0])
            })
            .catch(err => reject(err))
        })
    },
    registerUser: (firstName, lastName, street, city, state, zip, email, phoneNumber, countryOfOrigin, password) => {
        return new Promise((resolve, reject) => {
          let user = {}
          const hash = bcrypt.hashSync(password, 10)
          db.transaction(trx => {
            trx.insert({
              hash: hash,
              email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
              return trx('users')
                      .returning('*')
                      .insert({
                        fname: firstName,
                        lname: lastName,
                        street: street,
                        city: city,
                        state: state,
                        zip: zip,
                        email: loginEmail[0],
                        phonenumber: phoneNumber,
                        countryoforigin: countryOfOrigin,
                        usertype: 2
                      })
            })
            .then(data => {
              return resolve(data[0])
            })
            .then(trx.commit)
            .catch(trx.rollback)
          })
        })
    },

    getAthletes: () => {
        return new Promise((resolve, reject) => {
            db.select('fname', 'lname').from('users').where('usertype', '=', 2)
              .then(users => resolve(users))
              .catch(err => reject(users))
        })
    }
}