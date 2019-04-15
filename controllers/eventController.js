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

const fixingDates = (event) => {
    let events = event;
    let type;

    for(let b = 0; b < events.length; b++){
        let checktime = parseInt(events[b][2]);
        if (checktime >= 12) {
           if(checktime != 12){
                checktime -= 12;
                events[b][2] = checktime.toString() + events[b][2].substring(2, 5);
           }
            type = " PM";
        } else {
            type = " AM";
        }
        if(parseInt(events[b][2]) < 10 && type == " AM"){
            events[b][2] = events[b][2].toString().substring(1,5) + type;
        } else {
            events[b][2] = events[b][2].toString().substring(0,5) + type;
        }
    }

    for(let b = 0; b < events.length; b++){
        events[b][3] = new Date(events[b][3]).toString().substring(4,15);
    }
    return events;
}

module.exports = {
    getAllEvents: (req, res, next) => {
        return eventService.getAllEvents()
            .then(response => {
                let compEvents = compEventsArrayify(response.compEvent)
                compEvents = fixingDates(compEvents);
                let awardEvents = compEventsArrayify(response.ceremonyEvents)
                awardEvents = fixingDates(awardEvents);
                let autoEvents = compEventsArrayify(response.autoEvents)
                autoEvents = fixingDates(autoEvents);
                
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
    getAthleteEvents: (req, res, next) => {
        const { id } = req.body
        return eventService.getAthleteEvents(id)
            .then(response => {
                const allEvents = compEventsArrayify(response)
                return res.status(200).send({response: allEvents})
            })
            .catch(err => res.status(404).send(err))
    },
    getCompEvents: (req, res, next) => {
        return eventService.getCompEvents() 
            .then(response => res.status(200).send(response))
            .catch(err => res.status(404).send({ err: "Not Found" }))
    },
    createCompetitionEvent: (req, res, next) => {
        const { sportname, newTime, venue, newDate, filteredRegisteredAthletes, createdBy } = req.body
        return eventService.createCompetitionEvent(sportname, newTime, venue, newDate, filteredRegisteredAthletes, createdBy)
            .then(response => {
                return res.status(200).send({
                    resp: response
                })
            })
            .catch(err => res.status(400).send({ err: "ERRR" }))
    },
    createCeremonyEvent: (req, res, next) => {
        const { selectedEvent, firstPlace, secondPlace, thirdPlace, newTime, newDate, venue, createdBy } = req.body
        return eventService.createCeremonyEvent(selectedEvent.eventid, firstPlace.userid, secondPlace.userid, thirdPlace.userid, newTime, newDate, venue, createdBy)
            .then(response => res.status(200).send({response}))
            .catch(err => res.status(400).send({err: "failed to add"}))
    },
    createAutographEvent: (req, res, next) => {
        const { athleteUserId, newTime, venue, newDate } = req.body
        return eventService.createAutographEvent(athleteUserId, newTime, venue, newDate)
            .then(response => res.status(200).send(response))
            .catch(err => res.status(400).send({err}))
    }
}