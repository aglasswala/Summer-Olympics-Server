const ticketService = require('../services/ticket/ticketService')
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

module.exports = {
    getUserTickets: (req, res, next) => {
        const { id } = req.body
        return ticketService.getUserTickets(id) 
            .then(response => 
                res.status(200).send(response))
            .catch(err => res.status(404).send(err))
    },
    buyTickets: (req, res, next) => {
      const { event, timestamp, cost, userid } = req.body
      return ticketService.buyTickets(event, timestamp, cost, userid)
        .then(response => res.status(200).send(response))
        .catch(err => res.status(400).send({err: "NOT FOUND"}))
    }
}