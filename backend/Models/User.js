// backend/Models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileType: { type: String, enum: ["Teen", "Senior"], required: true },
  interests: { type: String, required: true },
  skills: { type: String, required: true },
  profilePic: { type: String, default: "https://placehold.co/150x150" },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;

