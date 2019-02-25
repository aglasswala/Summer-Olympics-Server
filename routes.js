const ticketController = require('./controllers/ticketController');
const userController = require('./controllers/userController')

module.exports = (router) => {

    router.get('/', (req, res) => res.status(200).send("HELLO WORLD"));

    router.get('/tickets', ticketController.getTicket)

    router.post('/tickets', ticketController.buyTicket)

    router.put('/tickets', (req, res) => {
        const { _id, time, cost, eventId, userId } = req.body;
        const index = db.tickets.findIndex((obj => obj._id == _id));
        db.tickets[index].time = time,
            db.tickets[index].cost = cost,
            db.tickets[index].eventId = eventId,
            db.tickets[index].userID = userId,
            res.send(db.tickets).status(200);
    })

    router.get('/events', (req, res) => {
        res.send(db.events).status(200);
    })

    router.get('/events/:eventId', (req, res) => {
        const { eventId } = req.params;
        const index = db.events.findIndex((ind => ind._id === eventId));
        res.send(db.events[index]).status(200);
    })

    router.post('/events', (req, res) => {
        res.send("Creating new event").status(200);
    })

    router.get('/users', userController.getUser)

    router.post('/users', userController.addUser)
};