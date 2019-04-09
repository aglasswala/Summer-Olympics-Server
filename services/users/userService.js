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
            const user = ticketService.db.users.find(user => user.email === email && user.password === password)
            return resolve(user);
        })
        .catch(err => {
            return reject(err)
        })
    },
    getUserById: (userId) => {
        return new Promise((resolve, reject) => {
            const user = ticketService.db.users.find(user => user._id === userId)
            if(!user) {
                return reject()
            }
            return resolve(user);
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
                        usertype: 1
                      })
            })
            .then(data => {
              console.log(data)
              return resolve(data[0])
            })
            .then(trx.commit)
            .catch(trx.rollback)
          })
        })
    },

    getAthletes: () => {
        return new Promise((resolve, reject) => {
            const athletes = ticketService.db.users.filter(user => user.userType === "athlete")
            return resolve(athletes)
        })
    }
}