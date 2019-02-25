const userService = require('../services/users/userService')


module.exports = {
    getUser: (req, res, next) => {
        return userService.getUser()
            .then(response => {
                return res.status(200).send(response)
            })
            .catch(next);
    },
    addUser: (req, res, next) => {
        const { firstName, lastName, email, phoneNumber, age } = req.body
        return userService.addUser(firstName, lastName, email, phoneNumber, age)
            .then(response => {
                return res.status(200).send(response)
            })
            .catch(next);
    }

}