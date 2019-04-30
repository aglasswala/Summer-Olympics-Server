require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./routes');

function startServer(server) {
  const { APP_PORT } = process.env;

  server.listen(APP_PORT || 3000, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on ${APP_PORT}`);
  });
}

async function init() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  router(app);
  startServer(app);
}

init();
