const ticketController = require('./controllers/ticketController');
const userController = require('./controllers/userController')
const eventController = require('./controllers/eventController')

module.exports = (router) => {
    
    router.get('/', (req, res) => res.status(200).send("OH YEAH"));
    
    // TICKETS
    router.get('/tickets', ticketController.getTicket) 

    router.post('/tickets', ticketController.buyTicket)

    router.put('/tickets', ticketController.updateTicket) 

    // EVENTS
    router.get('/api/events', eventController.getAllEvents)
    router.get('/events/:eventId', eventController.getEventById) // GET events by Id

    router.post('/events', eventController.createEvent) // POST new Event

    // Login information
    router.post('/api/login', userController.loginUser)
    router.get('/api/login', userController.getUserById)

    // Register information
    router.post('/register', userController.registerUser)

    // router.get('/user/:userId/tickets', (req, res) => {
    //     res.status(200).send("this is a better endpoint"); // GET user tickets by ID
    // })

    // router.delete('/users/:userId', userController.deleteUser) // Deletes User
};