const ticketController = require('./controllers/ticketController');
const userController = require('./controllers/userController');
const eventController = require('./controllers/eventController');

module.exports = (router) => {
  router.get('/', (req, res) => res.status(200).send('OH YEAH'));

  // Tickets
  router.post('/api/getUserTickets', ticketController.getUserTickets);
  router.post('/api/BuyTickets', ticketController.buyTickets);

  // EVENTS
  router.get('/api/events', eventController.getAllEvents);
  router.get('/api/getCompEvents', eventController.getCompEvents);
  router.get('/api/getCereEvents', eventController.getCereEvents);
  router.get('/api/getMedalists', eventController.getMedalists);
  router.get('/api/getAutographEvents', eventController.getAutographEvents);

  router.post('/api/deleteEvent', eventController.deleteEvent);
  router.post('/api/deleteCeremonyEvents', eventController.deleteCeremonyEvents);
  router.post('/api/deleteAutographEvents', eventController.deleteAutographEvents);

  router.post('/api/createCompetitionEvent', eventController.createCompetitionEvent);
  router.post('/api/createCeremonyEvent', eventController.createCeremonyEvent);
  router.post('/api/createAutographEvent', eventController.createAutographEvent);

  router.post('/api/editEvent', eventController.editEvent);

  // Login information
  router.post('/api/login', userController.loginUser);
  router.post('/api/getUser', userController.getUserById);
  router.post('/api/register', userController.registerUser);
  router.post('/api/updateProfile', userController.updateProfile)

  // Get Athletes
  router.get('/api/getAthletes', userController.getAthletes);
  router.post('/api/getRegisteredAthletes', userController.getRegisteredAthletes);

  // Get all athlete events
  router.post('/api/getAthleteEvents', eventController.getAthleteEvents);

  router.post('/api/getNotifications', userController.getNotifications);
  router.post('/api/deleteNotifications', userController.deleteNotifications);
};
