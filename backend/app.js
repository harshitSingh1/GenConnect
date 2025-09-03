const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const ConnectionRouter = require('./Routes/ConnectionRouter');

require('dotenv').config();
require('./Models/db');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:3000",
      "https://genconnect.vercel.app",
      "https://genconnect-server.vercel.app"
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

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
app.use('/connections', ConnectionRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // CORS error handling
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ 
      success: false, 
      message: "CORS policy: Origin not allowed" 
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

module.exports = app;