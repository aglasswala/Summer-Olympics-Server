const userService = require('../services/users/userService')


module.exports = {
    getUser: (req, res, next) => {
        return userService.getUser()
            .then(response => {
                return res.status(200).send({
                    count: response.length,
                    users: response.map(doc => {
                        return {
                            _id: doc._id,
                            firstName: doc.firstName,
                            lastName: doc.lastName,
                            email: doc.email,
                            phoneNumber: doc.phoneNumber,
                            userType: doc.userType
                        }
                    })

                })
            })
            .catch(err => {
                return res.status(500).send(err);
            });
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