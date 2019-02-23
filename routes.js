let db = {
    users: [
        {
            _id: "user1",
            firstName: "Dill",
            lastName: "Glasswala",
            address: "345 River Rd",
            email: "aglasswala@gmail.com",
            age: 20,
            phoneNumber: "2012148385",
            userType: "public",
            tickets: ["ticket1", "ticket2"]
        },
        {
            _id: "user2",
            firstName: "Steve",
            lastName: "john",
            address: "345 River Rd",
            email: "steve@gmail.com",
            age: 20,
            representingCountry: "USA",
            phoneNumber: "2012148385",
            userType: "athlete",
            registeredEvents: ["event1"],
            tickets: ["ticket2", "ticket3"]
        },
        {
            _id: "user3",
            firstName: "Jack",
            lastName: "smith",
            address: "345 River Rd",
            email: "jack@gmail.com",
            age: 20,
            phoneNumber: "2012148385",
            createdEvents: ["event1"],
            userType: "employee",
            tickets: ["ticket4"]
        },
        {
            _id: "user4",
            firstName: "Matt",
            lastName: "wingmaster69",
            address: "345 River Rd",
            email: "matt@gmail.com",
            age: 20,
            phoneNumber: "2012148385",
            userType: "public",
            tickets: ["ticket3"]
        },
    ],
    tickets: [
        {
            _id: "ticket1",
            time: new Date(),
            cost: 30,
            eventId: "event1",
            userID: "user1"
        },
        {
            _id: "ticket2",
            time: new Date(),
            cost: 30,
            eventId: "event2",
            userId: "user1"
        },
        {
            _id: "ticket3",
            time: new Date(),
            cost: 30,
            eventId: "event1",
            userId: "user4"
        },
        {
            _id: "ticket4",
            time: new Date(),
            cost: 0,
            eventId: "event2",
            userId: "user3"
        },

    ],
    events: [
        {
            _id: "event1",
            name: "Swimming",
            registeredTickets: ["ticket1", "ticket3"],
            athletes: ["user2"],
            results: ["user2"],
            type: "competition",
            createdBy: "user2"
        },
        {
            _id: "event2",
            name: "Soccer",
            attendees: ["user1"],
            registeredTickets: ["ticket4"],
            athletes: ["user2"],
            results: ["user2"],
            type: "competition",
            createdBy: "user3"
        }
    ]

}


module.exports = (router) => {

    router.get('/', (req, res) => res.status(200).send("HELLO WORLD"));

    router.get('/tickets', (req, res) => {
        res.send(db.tickets).status(200);
    })

    router.post('/tickets', (req, res) => {
        const { _id, time , cost, eventId, userId } = req.body;

        db.tickets.push({
            _id: _id,
            time: time,
            cost: cost,
            eventId: eventId,
            userId: userId,
        })

        res.send(db.tickets).status(200);
    })

    router.put('/tickets', (req, res) => {
        const { _id, time, cost, eventId, userId } = req.body;
        const index = db.tickets.findIndex((ind => ind._id == _id));
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
        const index = db.events.findIndex((ind => ind._id === eventId));Y
        res.send(db.events[index]).status(200);
    })

    router.post('/events', (req, res) => {
        res.send("Creating new event").status(200);
    })

    router.get('/users', (req, res) => {
        res.send(db.users).status(200);
    })

    router.post('/users', (req, res) => {
        res.send(db.users).status(200);
    })
};