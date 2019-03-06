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
                    const userToken = jwt.sign({ id: user._id }, SECURE_KEY_JWT, {
                        expiresIn: '1hr'
                    })
                    return res.status(200).send({
                        userToken
                    });
                }
                return res.status(404)
            })
            .catch(err => console.log(err));
            
    },
    getUser: (req, res, next) => {
        const { SECURE_KEY_JWT } = process.env
        const decoded = jwt.verify(req.headers['x-access-token'], SECURE_KEY_JWT);
        return userService.getUserById(decoded.id)
            .then(response => {
                res.status(200).send(response)
            })

        return res.status(200).send({
            resp: "OK"
        })

        // return userService.getUserById(token) // over here
        //     .then(user => res.status(200).send(user))
        //     .catch(err => console.log(err))
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