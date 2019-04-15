const ticketService = require('../services/ticket/ticketService')

module.exports = {
    getUserTickets: (req, res, next) => {
        const { id } = req.body
        return ticketService.getUserTickets(id) 
            .then(response => res.status(200).send(response))
            .catch(err => res.status(404).send(err))
    }
}