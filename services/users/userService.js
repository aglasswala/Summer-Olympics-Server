const ticketService = require('../ticket/ticketService')
const mongoose = require('mongoose')

module.exports = {
    getUser: () => {
        return new Promise((resolve, reject) => {
            return resolve(ticketService.db.users)
        })
    },
    addUser: (firstName, lastName, email, phoneNumber, age) => {
        return new Promise((resolve, reject) => {
            ticketService.db.users.push({
                _id: mongoose.Types.ObjectId(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                age: age,
                phoneNumber: phoneNumber,
                userType: "public",
                tickets: []
            })
            return resolve(ticketService.db.users)
        })
    }
}