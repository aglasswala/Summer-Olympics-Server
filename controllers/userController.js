const userService = require('../services/users/userService')
const auth = require('../auth/auth')


module.exports = {
    loginUser: (req, res, next) => {
        const { email, password } = req.body
        // Validate EMAIL and PASSWORD
        return userService.getUser(email, password)
            .then(user => {
                const data = auth.createJwt(user)
                return res.status(200).send({
                    userToken: data,
                    user
                })
            })
            .catch(err => res.status(404).send(err));
    },
    getUserById: (req, res, next) => {
        const { id } = req.body
        return userService.getUserById(id)
            .then(response => {
                return res.status(200).send(response)
            })
            .catch(err => res.status(404).send("dasdf"))
    },
    registerUser: (req, res, next) => {
        const { firstName, lastName, street, city, state, zip, email, password, age, phoneNumber } = req.body
        // TODO VALIDATE and Hash password
        return userService.registerUser("firstName", "lastName", "street", "city", "NJ" , 07603 , "aglasswala@gmail.com", "US")
            // .then(result => auth.createJwt(result))
            .then(data => {
                const token = auth.createJwt(data._id)
                return res.status(200).send({
                    user: data,
                    token
                })
            })
            .catch(err => res.status(404).send(err))
    },
    getAthletes: (req, res, next) => {
        return userService.getAthletes()
            .then(data => res.status(200).send({
                athletes: data
            }))
            .catch(err => res.status(400).send({err}))
    }
}