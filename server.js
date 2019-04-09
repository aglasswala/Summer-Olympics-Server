require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const knex = require('knex')

const router = require('./routes');

function startServer(server) {

    const { APP_PORT, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = process.env

    server.listen(APP_PORT || 3000, () => {
        console.log(`Server is listening on ${APP_PORT}`)
    })

}

async function init() {
    const app = express();

    app.use(bodyParser.json());
    app.use(cors());

    router(app);
    startServer(app);
}

init();