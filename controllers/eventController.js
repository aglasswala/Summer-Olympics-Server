const eventService = require('../services/events/eventService')

module.exports = {
    getAllEvents: (req, res, next) => {
        return eventService.getAllEvents()
            .then(response => {
                // let output = response.map((obj) => {
                //     return Object.keys(obj).sort().map((key) => {
                //         return obj[key]
                //     })
                // })
                // output = Array.from(output)
                let newData = []
                for(let i = 0; i < response.length; i++) {
                    newData.push({
                        id: response[i]._id,
                        name: response[i].name,
                        registeredTickets: response[i].registeredTickets.length,
                        athletes: response[i].athletes.length,
                        type: response[i].type
                    })
                }
                let output = newData.map((obj) => {
                    return Object.keys(obj).sort().map((key) => {
                        return obj[key]
                    })
                })
                output = Array.from(output)
                console.log(output)
                return res.status(200).send(output)
            })
            .catch(err => res.status(404).send(err));
    },
    getEventById: (req, res, next) => {
        const { eventId } = req.params;
        return eventService.getEvent(eventId)
            .then(response => res.status(200).send(response))
            .catch(err => res.status(404).send(err));
    },
    createEvent: (req, res, next) => {
        const { nameOfEvent, time, athletes, type, userId } = req.body
        return eventService.createEvent(nameOfEvent, time, athletes, type, userId)
            .then(response => res.status(200).send(response))
            .catch(err => res.status(404).send(err))
    }
}