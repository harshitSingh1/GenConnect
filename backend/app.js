const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
require('./Models/db');

const app = express();

// Allow frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://genconnect.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy error: Origin not allowed"));
    }
  },
  credentials: true
}));

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

module.exports = app;
