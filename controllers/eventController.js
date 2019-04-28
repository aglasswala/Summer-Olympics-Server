const eventService = require('../services/events/eventService');

const compEventsArrayify = (response) => {
  const newData = [];
  response.map(event => (
    newData.push([
      event.sportname,
      event.venue,
      event.time,
      event.date,
    ])
  ));
  return newData;
};

const fixingDates = (event) => {
  const events = event;
  let type;

  for (let b = 0; b < events.length; b += 1) {
    let checktime = parseInt(events[b][2], 10);
    if (checktime >= 12) {
      if (checktime !== 12) {
        checktime -= 12;
        events[b][2] = checktime.toString() + events[b][2].substring(2, 5);
      }
      type = ' PM';
    } else {
      type = ' AM';
    }
    if (parseInt(events[b][2], 10) < 10 && type === ' AM') {
      events[b][2] = events[b][2].toString().substring(1, 5) + type;
    } else {
      events[b][2] = events[b][2].toString().substring(0, 5) + type;
    }
  }

  for (let b = 0; b < events.length; b += 1) {
    events[b][3] = new Date(events[b][3]).toString().substring(4, 15);
  }
  return events;
};

const fixingTime = (time) => {
  let checktime = parseInt(time, 10);
  if (checktime < 12 && time.includes('AM')) {
    return `${checktime}:00:00`;
  }
  if (checktime === 12) {
    checktime = `${checktime.toString()}:00:00`;
    return checktime;
  }
  checktime += 12;
  checktime = `${checktime.toString()}:00:00`;
  return checktime;
};

const changeAMPMto24Hours = (date) => {
  let newMonth = date.getMonth() + 1;
  let newDay;
  const newYear = date.getFullYear().toString();

  if (date.getMonth() + 1 < 10) {
    newMonth = `0${newMonth.toString()}`;
  } else {
    newMonth = newMonth.toString();
  }

  if (date.getDate() < 10) {
    newDay = `0${date.getDate().toString()}`;
  } else {
    newDay = date.getDate().toString();
  }
  return `${newYear}-${newMonth}-${newDay}`;
};

const updateEventTimesandDates = (selectedEvent) => {
  const updatedEvent = {};
  updatedEvent.sportname = selectedEvent.sportname;
  updatedEvent.venue = selectedEvent.venue;
  updatedEvent.time = fixingTime(selectedEvent.time);
  updatedEvent.date = changeAMPMto24Hours(new Date(selectedEvent.date));
  updatedEvent.eventid = selectedEvent.eventid;
  updatedEvent.userid = selectedEvent.userid;
  return updatedEvent;
};

module.exports = {
  getAllEvents: (req, res) => eventService
    .getAllEvents()
    .then((response) => {
      let compEvents = compEventsArrayify(response.compEvent);
      compEvents = fixingDates(compEvents);
      let awardEvents = compEventsArrayify(response.ceremonyEvents);
      awardEvents = fixingDates(awardEvents);
      let autoEvents = compEventsArrayify(response.autoEvents);
      autoEvents = fixingDates(autoEvents);

      const result = {
        compEvents,
        awardEvents,
        autoEvents,
        allEvents: response.allEvents,
      };

      return res.status(200).send(result);
    })
    .catch(err => res.status(404).send({ err })),
  getAthleteEvents: (req, res) => {
    const { id } = req.body;
    return eventService
      .getAthleteEvents(id)
      .then((response) => {
        const allEvents = {};
        allEvents.ceremonyEvents = compEventsArrayify(response.ceremonyEvents);
        allEvents.response = compEventsArrayify(response.result);
        return res.status(200).send(allEvents);
      })
      .catch(err => res.status(404).send(err));
  },
  getCompEvents: (req, res) => eventService
    .getCompEvents()
    .then(response => res.status(200).send(response))
    .catch(err => res.status(404).send({ err })),
  getCereEvents: (req, res) => eventService
    .getCereEvents()
    .then(response => res.status(200).send(response))
    .catch(err => res.status(404).send({ err })),
  getAutographEvents: (req, res) => eventService
    .getAutographEvents()
    .then(response => res.status(200).send(response))
    .catch(err => res.status(404).send({ err })),
  createCompetitionEvent: (req, res) => {
    const {
      sportname, newTime, venue, newDate, filteredRegisteredAthletes, createdBy,
    } = req.body;
    return eventService
      .createCompetitionEvent(
        sportname,
        newTime,
        venue,
        newDate,
        filteredRegisteredAthletes,
        createdBy,
      )
      .then(response => res.status(200).send({
        resp: response,
      }))
      .catch(err => res.status(400).send({ err }));
  },
  createCeremonyEvent: (req, res) => {
    const {
      selectedEvent,
      firstPlace,
      secondPlace,
      thirdPlace,
      newTime,
      newDate,
      venue,
      createdBy,
    } = req.body;
    return eventService
      .createCeremonyEvent(
        selectedEvent.eventid,
        firstPlace.userid,
        secondPlace.userid,
        thirdPlace.userid,
        newTime,
        newDate,
        venue,
        createdBy,
      )
      .then(response => res.status(200).send({ response }))
      .catch(err => res.status(400).send({ err }));
  },
  createAutographEvent: (req, res) => {
    const {
      athleteUserId, newTime, venue, newDate,
    } = req.body;
    return eventService
      .createAutographEvent(athleteUserId, newTime, venue, newDate)
      .then(response => res.status(200).send(response))
      .catch(err => res.status(400).send({ err }));
  },
  deleteEvent: (req, res) => {
    const { eventid } = req.body;
    return eventService
      .deleteEvent(eventid)
      .then(result => res.status(200).send({ result }))
      .catch(err => res.status(400).send(err));
  },
  deleteCeremonyEvents: (req, res) => {
    const { eventid } = req.body;
    return eventService
      .deleteCeremonyEvents(eventid)
      .then(result => res.status(200).send({ result }))
      .catch(err => res.status(400).send(err));
  },
  deleteAutographEvents: (req, res) => {
    const { eventid } = req.body;
    return eventService
      .deleteAutographEvents(eventid)
      .then(result => res.status(200).send({ result }))
      .catch(err => res.status(400).send(err));
  },
  editEvent: (req, res) => {
    const { selectedEvent } = req.body;
    const updatedEvent = updateEventTimesandDates(selectedEvent);
    return eventService
      .editEvent(updatedEvent)
      .then(result => res.status(200).send(result))
      .catch(err => res.status(404).send(err));
  },
};
