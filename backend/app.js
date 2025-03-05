const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
require('./Models/db');

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome to the Backend API');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

// Export the app (for Vercel)
module.exports = app;
