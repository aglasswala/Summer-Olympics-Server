const userService = require('../services/users/userService')
const jwt = require('jsonwebtoken')


module.exports = {
    loginUser: (req, res, next) => {
        const { email, password } = req.body
        const { SECURE_KEY_JWT } = process.env
        // Validate EMAIL and PASSWORD
        return userService.getUser(email, password)
            .then(user => {
                if(user) {
                    const userToken = jwt.sign(user, SECURE_KEY_JWT)
                    res.cookie('userSession', userToken, { maxAge: 1000 * 60 * 60 });
                    return res.status(200).json({
                        response: true
                    });
                }
                return res.status(404)
            })
            
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