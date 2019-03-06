const ticketController = require('./controllers/ticketController');
const userController = require('./controllers/userController')
const eventController = require('./controllers/eventController')
const verifyToken = require('./helpers/checkToken')

module.exports = (router) => {

    // This will load when the front page loads
    router.get('/', (req, res) => res.status(200).send("OH YEAH"));

    // TICKETS
    router.get('/tickets', ticketController.getTicket) // GET all tickets

    router.post('/tickets', ticketController.buyTicket) // POST new Ticket

    router.put('/tickets', ticketController.updateTicket) // Update Ticket 

    // EVENTS
    router.get('/events', eventController.getAllEvents) // GET all events

    router.get('/events/:eventId', eventController.getEventById) // GET events by Id

    router.post('/events', eventController.createEvent) // POST new Event

    // USERS
    router.post('/login', userController.loginUser) // Logs in user

    router.get('/getUser', userController.getUser)

    router.get('/user/:userId/tickets', (req, res) => {
        res.status(200).send("this is a better endpoint"); // GET user tickets by ID
    })

    router.delete('/users/:userId', userController.deleteUser) // Deletes User
};