require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')

const router = require('./routes');

function startServer(server) {

    const { MONGODB_USER, MONGODB_PASSWORD, APP_PORT } = process.env
    mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@summerolympics-0tpzz.mongodb.net/test?retryWrites=true`, {
        useNewUrlParser: true
    }).catch((err) => {
        console.log(err)
    });

    mongoose.connection.once('open', function () {
        console.log("MongoDB is connected")
        server.listen(APP_PORT || 3000, () => {
            console.log(`Server is listening on ${APP_PORT}`)
        })
    })
}

async function init() {
    const app = express();

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    app.use(bodyParser.json());
    app.use(cors());

    router(app);
    startServer(app);
}

init();