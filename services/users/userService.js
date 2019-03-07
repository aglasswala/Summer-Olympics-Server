const ticketService = require('../ticket/ticketService');
const uuid = require('uuid/v1');

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
    registerUser: (firstName, lastName, street, city, state, zip, email, password, age, phoneNumber) => {
        return new Promise((resolve, reject) => {
            const newUser = {
                _id: uuid(),
                firstName,
                lastName,
                street,
                city,
                state,
                zip,
                email,
                password,
                age,
                phoneNumber,
                userType: "public",
                tickets: []
            }
            const user = ticketService.db.users.push(newUser)
            return resolve(newUser);
        })
    }
}