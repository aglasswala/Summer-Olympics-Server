const eventService = require('../services/events/eventService')

module.exports = {
    getAllEvents: (req, res, next) => {
        return eventService.getAllEvents()
        .then(response => res.status(200).send(response))
        .catch(next);
    },
    getEvent: (req, res, next) => {
        const { eventId } = req.params;
        return eventService.getEvent(eventId)
        .then(response => res.status(200).send(response))
        .catch(next);
    }
}