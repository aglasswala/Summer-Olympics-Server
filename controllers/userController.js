const userService = require('../services/users/userService');
const auth = require('../auth/auth');

module.exports = {
  loginUser: (req, res) => {
    const { email, password } = req.body;
    // Validate EMAIL and PASSWORD
    return userService
      .getUser(email, password)
      .then((user) => {
        const data = auth.createJwt(user.userid);
        console.log(data)
        return res.status(200).send({
          userToken: data,
          user,
        });
      })
      .catch(err => res.status(404).send({ err: "THIS IS WHERE IT" }));
  },
  getUserById: (req, res) => {
    const { id } = req.body;
    return userService
      .getUserById(id)
      .then(response => res.status(200).send(response))
      .catch(err => res.status(404).send(err));
  },
  registerUser: (req, res) => {
    const {
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
      email,
      phoneNumber,
      countryOfOrigin,
      password,
    } = req.body;
    // TODO VALIDATE
    return userService
      .registerUser(
        firstName,
        lastName,
        street,
        city,
        state,
        zip,
        email,
        phoneNumber,
        countryOfOrigin,
        password,
      )
      .then((data) => {
        const token = auth.createJwt(data.userid);
        return res.status(200).send({
          user: data,
          token,
        });
      })
      .catch(err => res.status(404).send(err));
  },
  getAthletes: (req, res) => userService
    .getAthletes()
    .then(data => res.status(200).send({
      athletes: data,
    }))
    .catch(err => res.status(400).send({ err })),
  getRegisteredAthletes: (req, res) => {
    const { eventid } = req.body;
    return userService
      .getRegisteredAthletes(eventid)
      .then(result => res.status(200).send(result))
      .catch(err => res.status(404).send(err));
  },
  getNotifications: (req, res) => {
    const { userid } = req.body;
    return userService
      .getNotifications(userid)
      .then(result => res.status(200).send(result))
      .catch(err => res.status(404).send([err]));
  },
  deleteNotifications: (req, res) => {
    const { id } = req.body;
    return userService
      .deleteNotifications(id)
      .then(response => res.status(200).send({response}))
      .catch(err => res.status(400).send(err));
  },
  updateProfile: (req, res) => {
    const { userid, firstname, lastname, city, street, state, zip, phonenumber, email, countryoforigin } = req.body
    return userService.updateProfile(userid, firstname, lastname, city, street, state, zip, phonenumber, email, countryoforigin)
      .then(result => res.status(200).send({ result }))
      .catch(err => res.status(400).send(err))
  }
};
