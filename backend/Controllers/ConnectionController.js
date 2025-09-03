const ConnectionModel = require("../Models/Connection");
const UserModel = require("../Models/User");

// Create connection request
const createConnection = async (req, res) => {
  try {
    const { targetUserId, sessionType, scheduledDate } = req.body;
    const initiatorId = req.user._id;

    if (initiatorId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot connect with yourself"
      });
    }

    // Check if connection already exists
    const existingConnection = await ConnectionModel.findOne({
      $or: [
        { user1: initiatorId, user2: targetUserId },
        { user1: targetUserId, user2: initiatorId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: "Connection already exists",
        connection: existingConnection
      });
    }

    // Get both users to find common interests/skills
    const [initiator, targetUser] = await Promise.all([
      UserModel.findById(initiatorId),
      UserModel.findById(targetUserId)
    ]);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const commonInterests = initiator.interests.filter(interest => 
      targetUser.interests.includes(interest)
    );

    const commonSkills = initiator.skills.filter(skill => 
      targetUser.skills.includes(skill)
    );

    const newConnection = new ConnectionModel({
      user1: initiatorId,
      user2: targetUserId,
      initiator: initiatorId,
      sessionType,
      scheduledDate,
      interestsInCommon: commonInterests,
      skillsInCommon: commonSkills
    });

    await newConnection.save();

    // Populate user details for response
    await newConnection.populate('user2', 'name profilePic profileType');

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      connection: newConnection
    });
  } catch (error) {
    console.error("Create connection error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating connection",
      error: error.message
    });
  }
};

// Get user's connections
const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    let query = {
      $or: [{ user1: userId }, { user2: userId }]
    };

    if (status) {
      query.status = status;
    }

    const connections = await ConnectionModel.find(query)
      .populate('user1', 'name profilePic profileType interests skills')
      .populate('user2', 'name profilePic profileType interests skills')
      .populate('initiator', 'name')
      .sort({ matchedOn: -1 });

    res.json({
      success: true,
      connections
    });
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching connections",
      error: error.message
    });
  }
};

// Update connection status
const updateConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const connection = await ConnectionModel.findOne({
      _id: connectionId,
      $or: [{ user1: userId }, { user2: userId }]
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found"
      });
    }

    // Check if user has permission to update this connection
    if (connection.status === "accepted" && status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an accepted connection"
      });
    }

    connection.status = status;
    await connection.save();

    await connection.populate('user1', 'name profilePic profileType');
    await connection.populate('user2', 'name profilePic profileType');

    res.json({
      success: true,
      message: `Connection ${status} successfully`,
      connection
    });
  } catch (error) {
    console.error("Update connection error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating connection",
      error: error.message
    });
  }
};

// Get recommended matches based on AI matching
const getRecommendedMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find users with matching profile type (opposite type)
    const targetProfileType = currentUser.profileType === "Teen" ? "Senior" : "Teen";

    // Find potential matches with common interests/skills
    const potentialMatches = await UserModel.find({
      _id: { $ne: userId },
      profileType: targetProfileType,
      $or: [
        { interests: { $in: currentUser.interests } },
        { skills: { $in: currentUser.skills } }
      ]
    }).select('-password');

    // Exclude users who already have connections
    const existingConnections = await ConnectionModel.find({
      $or: [{ user1: userId }, { user2: userId }]
    });

    const connectedUserIds = existingConnections.map(conn => 
      conn.user1.toString() === userId ? conn.user2.toString() : conn.user1.toString()
    );

    const filteredMatches = potentialMatches.filter(user => 
      !connectedUserIds.includes(user._id.toString())
    );

    // Calculate match score for each user
    const matchesWithScore = filteredMatches.map(match => {
      const commonInterests = currentUser.interests.filter(interest => 
        match.interests.includes(interest)
      ).length;

      const commonSkills = currentUser.skills.filter(skill => 
        match.skills.includes(skill)
      ).length;

      const matchScore = (commonInterests * 2) + (commonSkills * 1.5);
      
      return {
        ...match.toObject(),
        matchScore,
        commonInterests,
        commonSkills
      };
    });

    // Sort by match score (highest first)
    matchesWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      matches: matchesWithScore
    });
  } catch (error) {
    console.error("Get recommended matches error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recommended matches",
      error: error.message
    });
  }
};

module.exports = {
  createConnection,
  getConnections,
  updateConnection,
  getRecommendedMatches
};