const ticketController = require('./controllers/ticketController');
const userController = require('./controllers/userController')
const eventController = require('./controllers/eventController')

module.exports = (router) => {
    
    router.get('/', (req, res) => res.status(200).send("OH YEAH"));

    //Tickets 
    router.post('/api/getUserTickets', ticketController.getUserTickets)
    router.post('/api/BuyTickets', ticketController.buyTickets)

    // EVENTS
    router.get('/api/events', eventController.getAllEvents)

    router.get('/api/getCompEvents', eventController.getCompEvents)

    // Login information
    router.post('/api/login', userController.loginUser)
    router.post('/api/getUser', userController.getUserById)

    // Register information
    router.post('/api/register', userController.registerUser)

    // Get Athletes
    router.get('/api/getAthletes', userController.getAthletes)

    // Create new Event by Type
    router.post('/api/createCompetitionEvent', eventController.createCompetitionEvent)
    router.post('/api/createCeremonyEvent', eventController.createCeremonyEvent)
    router.post('/api/createAutographEvent', eventController.createAutographEvent)

    // Get all athlete events
    router.post('/api/getAthleteEvents', eventController.getAthleteEvents)

};