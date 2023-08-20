const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json()); // Parse incoming json data

app.use('/feed', feedRoutes);

app.listen(8080);
