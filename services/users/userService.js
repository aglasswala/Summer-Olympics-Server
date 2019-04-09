const ticketService = require('../ticket/ticketService');
const uuid = require('uuid/v1');
const db = require('../../database/database')

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
    registerUser: (firstName, lastName, street, city, state, zip, email, countryOfOrigin) => {
            console.log(db)
            db('users')
            .returning()
            .insert({
                FName: firstName,
                LName: lastName,
                street: street,
                city: city,
                state: state,
                zip: zip,
                email: email,
                phoneNumber: phoneNumber,
                countryOfOrigin: countryOfOrigin,
                userType: 1
            })
            .then(data => {
                console.log(data)
                return new Promise((resolve, reject) => {
                    return resolve(data)
                })
            })
            .catch(err => console.log(err))
            // return resolve(newUser);
    },

            // const newUser = {
            //     _id: uuid(),
            //     firstName,
            //     lastName,
            //     street,
            //     city,
            //     state,
            //     zip,
            //     email,
            //     password,
            //     age,
            //     phoneNumber,
            //     userType: "public",
            //     tickets: []
            // }
            // ticketService.db.users.push(newUser)
    getAthletes: () => {
        return new Promise((resolve, reject) => {
            const athletes = ticketService.db.users.filter(user => user.userType === "athlete")
            return resolve(athletes)
        })
    }
}