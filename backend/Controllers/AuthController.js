// backend\Controllers\AuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");


const signup = async (req, res) => {
    try {
        const { name, email, password, profileType, interests, skills } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User  already exists, you can log in', success: false });
        }
        const userModel = new UserModel({ name, email, password, profileType, interests, skills });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successful",
                success: true
            });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const getProfile = async (req, res) => {
    try {
      const user = await UserModel.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
      }
      res.status(200).json({ success: true, user });
    } catch (err) {
      res.status(500).json({ message: "Internal server error", success: false });
    }
  };

const updateProfile = async (req, res) => {
    try {
        const { name, profileType, interests, skills, profilePic } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user._id,
            { name, profileType, interests, skills, profilePic },
            { new: true }
        );

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating profile", error });
    }
};



module.exports = {
    signup,
    login,
    getProfile,
    updateProfile
};

