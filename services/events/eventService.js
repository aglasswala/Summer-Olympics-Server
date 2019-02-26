const ticketService = require('../ticket/ticketService')

module.exports = {
    getAllEvents: () => {
        return new Promise((resolve, reject) => {
            return resolve(ticketService.db.events);
        })
    },
    getEvent: (eventId) => {
        return new Promise((resolve, reject) => {
            const index = ticketService.db.events.findIndex((ind => ind._id === eventId));
            return resolve(ticketService.db.events[index]);
        })
    }
}