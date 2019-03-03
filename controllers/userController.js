const userService = require('../services/users/userService')


module.exports = {
    loginUser: (req, res, next) => {
        const { email, password } = req.body
        v
        return userService.getUser()
            .then(response => res.status(200).send(response))
            .catch(err => res.status(500).send(err));
    },
    addUser: (req, res, next) => {
        const { firstName, lastName, email, phoneNumber, age } = req.body
        return userService.addUser(firstName, lastName, email, phoneNumber, age)
            .then(response => {
                return res.status(200).send(response)
            })
            .catch(next);
    },
    deleteUser: (req, res, next) => {
        const { userId } = req.params
        return userService.deleteUser(userId)
            .then(result => {
                return res.status(200).send(result)
            })
            .catch(err => {
                return res.status(500).send(err);
            })
    }

}