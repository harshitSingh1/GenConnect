// backend\index.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.options("*", cors());

app.use(express.json({ limit: "10mb" })); // Increase payload limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

module.exports = app;

