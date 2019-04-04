const eventService = require('../services/events/eventService')

module.exports = {
    getAllEvents: (req, res, next) => {
        return eventService.getAllEvents()
            .then(response => {
                let newData = []
                for(let i = 0; i < response.length; i++) {
                    newData.push({
                        eventType: response[i].type.charAt(0).toUpperCase() + response[i].type.slice(1),
                        name: response[i].name,
                        stadium: response[i].stadium,
                        location: response[i].location,
                        time: response[i].time,
                        registeredTickets: response[i].registeredTickets.length,
                    })
                }
                let output = newData.map((obj) => {
                    return Object.keys(obj).map((key) => {
                        return obj[key]
                    })
                })
                output = Array.from(output)
                const result = {
                    output,
                    allEvents: response
                }
                return res.status(200).send(result)
            })
            .catch(err => res.status(404).send(err));
    },
    getEventById: (req, res, next) => {
        const { eventId } = req.params;
        return eventService.getEvent(eventId)
            .then(response => res.status(200).send(response))
            .catch(err => res.status(404).send(err));
    },
    createCompetitionEvent: (req, res, next) => {
        const { nameOfEvent, time, stadium, location, date, registeredAthletes, createdBy } = req.body
        return eventService.createCompetitionEvent(nameOfEvent, time, stadium, location, date, registeredAthletes, createdBy)
            .then(response => res.status(200).send({ resp: response }))
            .catch(err => res.status(400).send({ err }))
    }
}