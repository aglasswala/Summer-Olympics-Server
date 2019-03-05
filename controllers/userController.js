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
                    const userToken = jwt.sign({
                        expiresIn: '1hr',
                        data: user
                    }, SECURE_KEY_JWT)
                    return res.status(200).json(userToken);
                }
                return res.status(404)
            })
            .catch("didn't work")
            
    },
    getUser: (req, res, next) => {
        const { SECURE_KEY_JWT } = process.env
        jwt.verify(req.token, 'SECURE_KEY_JWT', (err, data) => {
            if(err) {
                return res.sendStatus(403);
            } else {
                return res.status(200).json({
                    message: "Sucessful Login",
                    data
                })
                console.log("SUCCESS")
            }
        })
        
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