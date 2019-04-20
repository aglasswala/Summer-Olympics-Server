const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1234',
    database: 'postgres'
  }
})

let database = {
    users: [
        {
            _id: "user1",
            firstName: "Dill",
            lastName: "Glasswala",
            street: "456 River Rd",
            city: "Bogota",
            state: "NJ",
            zip: "07603",
            email: "aglasswala@gmail.com",
            password: "123",
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
            password: "123",
            age: 20,
            representingCountry: "USA",
            phoneNumber: "2012148385",
            userType: "athlete",
            registeredEvents: ["event1"],
            tickets: ["ticket2", "ticket3"]
        },
        {
            _id: "user7",
            firstName: "John",
            lastName: "Appleseed",
            address: "345 River Rd",
            email: "johnj@gmail.com",
            password: "123",
            age: 20,
            representingCountry: "USA",
            phoneNumber: "2012148385",
            userType: "athlete",
            registeredEvents: ["event1", "event2"],
            tickets: ["ticket9", "ticket2"]
        },
        {
            _id: "user3",
            firstName: "Jack",
            lastName: "smith",
            address: "345 River Rd",
            email: "jack@gmail.com",
            password: "123",
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
            userId: "user1"
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
        }
    ],
    events: [
        {
            _id: "event1",
            name: "Swimming",
            registeredTickets: ["ticket1", "ticket3"],
            athletes: ["user2"],
            time: "12:00 PM",
            date: "",
            stadium: "Carioca Arena 3",
            location: "Rio de Janeiro, Brazil",
            type: "competition",
            createdBy: "user2"
        },
        {
            _id: "event2",
            name: "Soccer",
            registeredTickets: ["ticket1", "ticket3"],
            athletes: ["user2"],
            time: "12:00 PM",
            stadium: "Carioca Arena 3",
            location: "Rio de Janeiro, Brazil",
            type: "competition",
            createdBy: "user2"
        },
        {
            _id: "event3",
            name: "Weightlifting",
            registeredTickets: ["ticket1", "ticket3", "ticket4"],
            athletes: ["user2", "user5"],
            time: "12:00 PM",
            stadium: "Carioca Arena 3",
            location: "Rio de Janeiro, Brazil",
            type: "competition",
            createdBy: "user2"
        },
        {
            _id: "event4",
            name: "Soccer",
            registeredTickets: ["ticket1", "ticket3"],
            athletes: ["user2"],
            time: "12:00 PM",
            stadium: "Carioca Arena 3",
            location: "Rio de Janeiro, Brazil",
            type: "competition",
            createdBy: "user2"
        },
        {
            _id: "event5",
            name: "Awards",
            registeredTickets: ["ticket1", "ticket3"],
            event: "event2",
            athletes: ["user2", "user3", "user5"],
            time: "6:00 PM",
            stadium: "Carioca Arena 3",
            location: "Rio de Janeiro, Brazil",
            type: "awardCeremony",
            createdBy: "user2"
        },
        {
            _id: "event6",
            name: "Winner for event1",
            registeredTickets: ["ticket1", "ticket3"],
            event: "event1",
            athletes: ["user2", "user3", "user5"],
            time: "6:00 PM",
            stadium: "Carioca Arena 3",
            location: "Rio de Janeiro, Brazil",
            type: "awardCeremony",
            createdBy: "user2"
        },
        {
            _id: "event7",
            name: "Auto Graphs",
            registeredTickets: ["ticket1", "ticket3"],
            event: "event1",
            athletes: ["user2", "user3", "user5"],
            time: "6:00 PM",
            stadium: "Carioca Arena 3",
            location: "Rio de Janeiro, Brazil",
            type: "autographs",
            createdBy: "user2"
        },
    ]
}

module.exports = {
    database,
    getUserTickets: (id) => {
        return new Promise((resolve, reject) => {
            db
            .select('*')
            .from('tickets')
            .join('competitionevents', 'competitionevents.eventid', '=', 'tickets.eventid')
            .where('tickets.userid', id)
            .returning('*')
            .then(result => resolve(result))
            .catch(err => reject(err))
        })
    },
    buyTickets: (event, timestamp, cost, userid) => {
      return new Promise((resolve, reject) => {
        db('tickets')
          .returning("*")
          .insert({
            timestamp: timestamp,
            cost: cost,
            eventid: event,
            userid: userid
          })
          .then(result => resolve(result))
          .catch(err => reject(err))
      })
    }
}