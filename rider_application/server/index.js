require('dotenv').config();

const express = require('express'); // import express, express to create server
const app = express();  // instance of express
const cors = require('cors');
const bodyparser = require('body-parser');

const port = process.env.PORT;

const routes = require('./routes');
const db = require('./models');

app.use(cors());
app.use(bodyparser.json());

app.get('/', (req, res) => res.json({ hello: 'world' }));

app.use('/api/auth', routes.auth);
app.use('/api/ride', routes.ride);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;

    next(err);
});

app.listen(port, console.log('Server started on port 4100') );