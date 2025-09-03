const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parentalConsentSchema = new Schema({
    consented: { type: Boolean, default: true },
    parentEmail: { type: String, default: "" },
    consentedAt: { type: Date, default: Date.now }
}, { _id: false });

const sessionPreferencesSchema = new Schema({
    virtual: { type: Boolean, default: true },
    inPerson: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileType: { type: String, enum: ["Teen", "Senior"], required: true },
    interests: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    profilePic: { type: String, default: "https://placehold.co/150x150" },
    __v: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    dateOfBirth: { type: Date, default: new Date('2009-08-19T18:30:00.000Z') },
    isVerified: { type: Boolean, default: true },
    lastActive: { type: Date, default: Date.now },
    parentalConsent: { type: parentalConsentSchema, default: () => ({}) },
    points: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    sessionPreferences: { type: sessionPreferencesSchema, default: () => ({}) }
}, { 
    // This ensures the fields are stored in the specified order
    // Note: MongoDB doesn't guarantee field order, but this helps
    // Note: _id is always first in MongoDB documents
    versionKey: false // Remove the __v field if you don't want it
});

// If you want to match your existing records exactly, remove the __v field
// and let MongoDB handle versioning internally

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;