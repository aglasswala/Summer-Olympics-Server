const eventService = require('../services/events/eventService')

const compEventsArrayify = (response) => {
    let newData = []
    for(let i = 0; i < response.length; i++) {
        newData.push([
            response[i].sportname,
            response[i].venue,
            response[i].time,
            response[i].date
        ])
    }
    return newData
}

const awardEventsArrayify = async (events) => {
    const eventValues = []

    await Promise.all(events.map(async (event) => {
      return eventService.getCompetitionEvent(event.eventid)
        .then((competitionEvent) => {
          eventValues.push([
            competitionEvent.sportname,
            event.venue,
            event.time,
            event.date
          ]);
        })
        .catch(err => console.log(err))
    }));

    return eventValues;
}



module.exports = {
    getAllEvents: (req, res, next) => {
        return eventService.getAllEvents()
            .then(response => {
                const compEvents = compEventsArrayify(response.compEvent)
                const autoEvents = compEventsArrayify(response.autoEvents)
                const awardEvents = compEventsArrayify(response.ceremonyEvents) 
                const result = {
                    compEvents,
                    awardEvents,
                    autoEvents,
                    allEvents: response.allEvents
                }
                return res.status(200).send(result)
            })
            .catch(err => res.status(404).send({ err }))
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