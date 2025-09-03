const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectionRequestSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  message: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate connection requests
connectionRequestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

connectionRequestSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const ConnectionRequestModel = mongoose.model("connectionRequests", connectionRequestSchema);
module.exports = ConnectionRequestModel;