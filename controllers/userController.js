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
        console.log(req.body)
        return userService.getUserById(id)
            .then(response => {
                console.log(response)
                return res.status(200).send(response)
            })
            .catch(err => res.status(404).send("dasdf"))
    },
    // getUserById: (req, res, next) => {
    //     const decoded = auth.verifyJwt(req.headers['x-access-token']);
    //     return userService.getUserById(decoded.id)
    //         .then(response => {
    //             return res.status(200).send({
    //                 firstName: response.firstName,
    //                 lastName: response.lastName,
    //                 email: response.email,
    //                 age: response.age,
    //                 street: response.street,
    //                 city: response.city,
    //                 state: response.state,
    //                 zip: response.zip,
    //                 phoneNumber: response.phoneNumber,
    //                 tickets: response.tickets,
    //                 userType: response.userType
    //             })
    //         })
    //         .catch(err => res.status(404).send(err))
    // },
    registerUser: (req, res, next) => {
        const { firstName, lastName, street, city, state, zip, email, password, age, phoneNumber } = req.body
        // TODO VALIDATE and Hash password
        return userService.registerUser(firstName, lastName, street, city, state, zip, email, password)
            // .then(result => auth.createJwt(result))
            .then(data => {
                const token = auth.createJwt(data._id)
                return res.status(200).send(token)
            })
            .catch(err => res.status(404).send(err))
    }
}