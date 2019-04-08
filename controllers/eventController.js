const eventService = require('../services/events/eventService')

const arrayify = (response) => {
    let newData = []
    
    for(let i = 0; i < response.length; i++) {
        newData.push({
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
    return output
}

module.exports = {
    getAllEvents: (req, res, next) => {
        return eventService.getAllEvents()
            .then(response => {
                const compEvents = arrayify(response.compEvents)
                const awardEvents = arrayify(response.awardEvents)
                const autoEvents = arrayify(response.autoEvents)
                const result = {
                    compEvents,
                    awardEvents,
                    autoEvents,
                    allEvents: response.allEvents
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
            .then(response => {
                return res.status(200).send({
                    resp: response
                })
            })
            .catch(err => res.status(400).send({ err }))
    }
}