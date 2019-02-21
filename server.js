// env variables 
require('dotenv').config()

// imports 
const express = require('express');
const mongoose = require('mongoose');

const { MONGODB_USER, MONGODB_PASSWORD } = process.env
mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@summerolympics-0tpzz.mongodb.net/test?retryWrites=true`, {
    useNewUrlParser: true
})
const app = express();



app.get('/', (req, res) => {
    res.send("HELLO").status(200);
})




mongoose.connection.once('open', function () {
    console.log("MongoDB is connected")
    app.listen(process.env.APP_PORT || 3000, () => {
        console.log(`Server is listening on ${process.env.APP_PORT}`)
    })
})