const ticketService = require('../services/ticket/ticketService')

module.exports = {
    getTicket: (req, res, next) => {
        return ticketService.getTicket()
            .then(response => res.status(200).send(response))
            .catch(next);
    },
    // getTicketById: (req, res, next) => {
    //     const { userId } = req.params
    //     return ticketService.getTicketById(userId)
    //     .then(response => res.status(200).send(response))
    //     .catch(next) 
    // },
    buyTicket: (req, res, next) => {
        const { userId, eventId, cost } = req.body;
        return ticketService.buyUserTicket(userId, eventId, cost)
            .then(response => res.status(200).send(response))
            .catch(next);
    },
    updateTicket: (req, res, next) => {
        const { _id, time, cost, eventId, userId } = req.body;

        return ticketService.updateTicket(_id, time, cost, eventId, userId)
            .then(response => res.status(200).send(response))
            .catch(next);
    }
}