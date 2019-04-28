const ticketService = require('../services/ticket/ticketService');

module.exports = {
  getUserTickets: (req, res) => {
    const { id } = req.body;
    return ticketService
      .getUserTickets(id)
      .then(response => res.status(200).send(response))
      .catch(err => res.status(404).send(err));
  },
  buyTickets: (req, res) => {
    const {
      event, timestamp, cost, userid,
    } = req.body;
    return ticketService
      .buyTickets(event, timestamp, cost, userid)
      .then(response => res.status(200).send(response))
      .catch(err => res.status(400).send({ err }));
  },
};
