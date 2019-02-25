const ticketService = require('../services/ticket/ticketService')

module.exports = {
    buyTicket: (req, res, next) => {
        const { userId, eventId } = req.body;

        return ticketService.buyUserTicket(userId, eventId)
            .then(response => {
                return res.status(200).send(response)
            })
            .catch(next);
    },
    getTicket: (req, res, next) => {

        return ticketService.getTicket()
            .then(response => {
                return res.status(200).send(response);
            })
            .catch(next);
    }
}