const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const ConnectionRequestModel = require("../Models/ConnectionRequest");
const UserModel = require("../Models/User");

// Send connection request
router.post('/send-request', ensureAuthenticated, async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    
    if (req.user._id === toUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot send connection request to yourself"
      });
    }

    // Check if user exists
    const toUser = await UserModel.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if request already exists
    const existingRequest = await ConnectionRequestModel.findOne({
      fromUser: req.user._id,
      toUser: toUserId
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Connection request already sent"
      });
    }

    // Create new connection request
    const connectionRequest = new ConnectionRequestModel({
      fromUser: req.user._id,
      toUser: toUserId,
      message: message || ""
    });

    await connectionRequest.save();

    // Populate user details
    await connectionRequest.populate('fromUser', 'name profilePic profileType');
    await connectionRequest.populate('toUser', 'name profilePic profileType');

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      request: connectionRequest
    });
  } catch (error) {
    console.error("Send request error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending connection request"
    });
  }
});

// Get pending requests for current user
router.get('/pending-requests', ensureAuthenticated, async (req, res) => {
  try {
    const pendingRequests = await ConnectionRequestModel.find({
      toUser: req.user._id,
      status: "pending"
    }).populate('fromUser', 'name profilePic profileType skills interests');

    res.json({
      success: true,
      requests: pendingRequests
    });
  } catch (error) {
    console.error("Get pending requests error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending requests"
    });
  }
});

// Get sent requests for current user
router.get('/sent-requests', ensureAuthenticated, async (req, res) => {
  try {
    const sentRequests = await ConnectionRequestModel.find({
      fromUser: req.user._id,
      status: "pending"
    }).populate('toUser', 'name profilePic profileType skills interests');

    res.json({
      success: true,
      requests: sentRequests
    });
  } catch (error) {
    console.error("Get sent requests error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sent requests"
    });
  }
});

// Get connections (accepted requests)
router.get('/connections', ensureAuthenticated, async (req, res) => {
  try {
    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUser: req.user._id, status: "accepted" },
        { toUser: req.user._id, status: "accepted" }
      ]
    })
    .populate('fromUser', 'name profilePic profileType skills interests')
    .populate('toUser', 'name profilePic profileType skills interests');

    // Format connections to show the other user
    const formattedConnections = connections.map(connection => {
      const otherUser = connection.fromUser._id.toString() === req.user._id.toString() 
        ? connection.toUser 
        : connection.fromUser;
      
      return {
        _id: connection._id,
        user: otherUser,
        connectedAt: connection.updatedAt
      };
    });

    res.json({
      success: true,
      connections: formattedConnections
    });
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching connections"
    });
  }
});

// Accept connection request
router.put('/accept-request/:requestId', ensureAuthenticated, async (req, res) => {
  try {
    const request = await ConnectionRequestModel.findOne({
      _id: req.params.requestId,
      toUser: req.user._id,
      status: "pending"
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed"
      });
    }

    request.status = "accepted";
    await request.save();

    res.json({
      success: true,
      message: "Connection request accepted"
    });
  } catch (error) {
    console.error("Accept request error:", error);
    res.status(500).json({
      success: false,
      message: "Error accepting connection request"
    });
  }
});

// Reject connection request
router.put('/reject-request/:requestId', ensureAuthenticated, async (req, res) => {
  try {
    const request = await ConnectionRequestModel.findOne({
      _id: req.params.requestId,
      toUser: req.user._id,
      status: "pending"
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed"
      });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Connection request rejected"
    });
  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting connection request"
    });
  }
});

// Cancel sent request
router.delete('/cancel-request/:requestId', ensureAuthenticated, async (req, res) => {
  try {
    const request = await ConnectionRequestModel.findOneAndDelete({
      _id: req.params.requestId,
      fromUser: req.user._id,
      status: "pending"
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed"
      });
    }

    res.json({
      success: true,
      message: "Connection request cancelled"
    });
  } catch (error) {
    console.error("Cancel request error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling connection request"
    });
  }
});

module.exports = router;