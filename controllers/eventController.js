const eventService = require('../services/events/eventService')


const compEventsArrayify = (response) => {
    let newData = []
    for(let i = 0; i < response.length; i++) {
        newData.push({
            name: response[i].sportname,
            stadium: response[i].venue,
            time: response[i].time,
            date: response[i].date
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

const awardEventsArrayify = (response) => {
    let newData = []
    Promise.all(
        response.map(event => {
            eventService.getCompetitionEvent(event.eventid)
                .then(name => {
                    newData.push({
                        name: name.sportname,
                        stadium: event.venue,
                        time: event.time,
                        date: event.date
                    })
                })
                .catch(err => console.log(err))
        })
    )
    console.log(newData)
    
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
                const compEvents = compEventsArrayify(response.compEvents)
                const awardEvents = awardEventsArrayify(response.awardEvents)
                console.log(awardEvents)
                const autoEvents = compEventsArrayify(response.autoEvents)
                const result = {
                    compEvents,
                    awardEvents,
                    autoEvents,
                    allEvents: response.allEvents
                }
                return result
            })
            .then(result => {
                return res.status(200).send(result)
            })
            .catch(err => res.status(404).send(err));
    },
    getCompetitionEventById: (req, res, next) => {
        const { eventId } = req.params;
        return eventService.getCompetitionEvent(eventId)
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