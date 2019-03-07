const userService = require('../services/users/userService')
const auth = require('../auth/auth')
const jwt = require('jsonwebtoken')


module.exports = {
    loginUser: (req, res, next) => {
        const { email, password } = req.body
        // Validate EMAIL and PASSWORD
        return userService.getUser(email, password)
            .then(user => auth.createJwt(user))
            .then(data => {
                if(!data) {
                    res.status(404)
                }
                return res.status(200).send(data)
            })
            .catch(err => console.log(err));
            
    },
    getUserById: (req, res, next) => {
        const decoded = auth.verifyJwt(req.headers['x-access-token']);
        return userService.getUserById(decoded.id)
            .then(response => {
                return res.status(200).send({
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    age: response.age,
                    street: response.street,
                    city: response.city,
                    state: response.state,
                    zip: response.zip,
                    phoneNumber: response.phoneNumber,
                    tickets: response.tickets,
                    userType: response.userType
                })
            })
            .catch(err => res.status(404).send(err))
    },
    registerUser: (req, res, next) => {
        const { firstName, lastName, email, password } = req.body
        // TODO VALIDATE
        return userService.registerUser(firstName, lastName, email, password)
            .then(result => res.status(200).send(result))
            .catch(err => console.log(err))
    }
}