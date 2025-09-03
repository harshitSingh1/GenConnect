const mongoose = require("mongoose"); // ADD THIS IMPORT
const { signup, login, getProfile, updateProfile } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const ConnectionModel = require("../Models/ConnectionRequest");

const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const UserModel = require("../Models/User");

// Public routes
router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

// Protected routes
router.get('/profile', ensureAuthenticated, getProfile);
router.put('/update-profile', ensureAuthenticated, updateProfile);

// User search endpoint
router.get("/users", async (req, res) => {
  try {
    let query = {};
    if (req.query.profileType) query.profileType = req.query.profileType;
    if (req.query.skills) query.skills = { $in: [req.query.skills] };
    if (req.query.interests) query.interests = { $in: [req.query.interests] };
    if (req.query.searchQuery) query.name = new RegExp(req.query.searchQuery, "i");

    const users = await UserModel.find(query).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({ success: false, message: "Error searching users", error: error.message });
  }
});

// Enhanced user search endpoint
router.get("/users/search", ensureAuthenticated, async (req, res) => {
  try {
    let query = { _id: { $ne: req.user._id } }; // Exclude current user
    
    // Filter by profile type
    if (req.query.profileType && req.query.profileType !== "all") {
      query.profileType = req.query.profileType;
    }
    
    // Filter by skills (array contains)
    if (req.query.skills) {
      query.skills = { $in: [req.query.skills] };
    }
    
    // Filter by interests (array contains)
    if (req.query.interests) {
      query.interests = { $in: [req.query.interests] };
    }
    
    // Search by name
    if (req.query.searchQuery) {
      query.name = new RegExp(req.query.searchQuery, "i");
    }
    
    const users = await UserModel.find(query).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({ success: false, message: "Error searching users", error: error.message });
  }
});

// Fixed connection request endpoint
router.post("/connection/request", ensureAuthenticated, async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    
    // Validate recipientId using mongoose
    if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid recipient ID" 
      });
    }
    
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot connect with yourself" 
      });
    }
    
    // Check if recipient exists
    const recipient = await UserModel.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Check if connection already exists in either direction
    const existingConnection = await ConnectionModel.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ]
    });
    
    if (existingConnection) {
      let message = "Connection already exists";
      if (existingConnection.status === "pending") {
        message = "Connection request already sent and is pending";
      } else if (existingConnection.status === "accepted") {
        message = "You are already connected with this user";
      } else if (existingConnection.status === "rejected") {
        message = "Connection request was previously rejected";
      }
      
      return res.status(400).json({ 
        success: false, 
        message,
        status: existingConnection.status 
      });
    }
    
    // Create new connection request
    const newConnection = new ConnectionModel({
      requester: req.user._id,
      recipient: recipientId,
      message: message || ""
    });
    
    await newConnection.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Connection request sent successfully", 
      connection: newConnection 
    });
    
  } catch (error) {
    console.error("Connection request error:", error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Connection already exists between these users" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Error sending connection request", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Add this endpoint to your AuthRouter.js

// Check connection status with a specific user
router.get("/connection/status/:userId", ensureAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID" 
      });
    }
    
    // Check if connection exists in either direction
    const connection = await ConnectionModel.findOne({
      $or: [
        { requester: req.user._id, recipient: userId },
        { requester: userId, recipient: req.user._id }
      ]
    });
    
    if (connection) {
      return res.json({ 
        success: true, 
        status: connection.status,
        connection 
      });
    }
    
    res.json({ 
      success: true, 
      status: "not_connected" 
    });
    
  } catch (error) {
    console.error("Connection status error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error checking connection status", 
      error: error.message 
    });
  }
});

module.exports = router;