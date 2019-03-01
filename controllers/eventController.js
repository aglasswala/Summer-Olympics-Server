const eventService = require('../services/events/eventService')

module.exports = {
    getAllEvents: (req, res, next) => {
        return eventService.getAllEvents()
            .then(response => res.status(200).send(response))
            .catch(next);
    },
    getEventById: (req, res, next) => {
        const { eventId } = req.params;
        return eventService.getEvent(eventId)
            .then(response => res.status(200).send(response))
            .catch(next);
    },
    createEvent: (req, res, next) => {
        const { nameOfEvent, time, athletes, type, userId } = req.body
        return eventService.createEvent(nameOfEvent, time, athletes, type, userId)
            .then(response => res.status(200).send(response))
            .catch(next)
    }
}