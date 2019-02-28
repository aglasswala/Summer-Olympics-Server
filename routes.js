const ticketController = require('./controllers/ticketController');
const userController = require('./controllers/userController')
const eventController = require('./controllers/eventController')

module.exports = (router) => {

    // This will load when the front page loads
    router.get('/', (req, res) => res.status(200).send("OH YEAH"));

    // Show all the tickets 
    router.get('/tickets', ticketController.getTicket)

    // Get ticket by userId 
    // router.get('/tickets/userId', ticketController.getTicketById)

    // When a user buys a ticket, { userId, eventId, cost }
    router.post('/tickets', ticketController.buyTicket)

    // Update tickets, if venue or date have been changed
    router.put('/tickets', ticketController.updateTicket)

    // Show all events going on 
    router.get('/events', eventController.getAllEvents)

    // Get events by ID
    router.get('/events/:eventId', eventController.getEvent)

    // Create new Event, employees or athletes only 
    router.post('/events', (req, res) => {
        res.send("Creating new event").status(200);
    })

    // Get all users 
    router.get('/users', userController.getUser)

    router.get('/user/:userId', (req, res) => {
        res.status(200).send("this is a better endpoint");
    })

    router.get('/user/:userId/tickets', (req, res) => {
        res.status(200).send("this is a better endpoint");
    })

    // Register new user
    router.post('/users', userController.addUser)
};