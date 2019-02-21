const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const APP_PORT = 3001;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("HELLO").status(200);
})

app.listen(APP_PORT, () => {
    console.log(`Server is listening on ${APP_PORT}`)
})
