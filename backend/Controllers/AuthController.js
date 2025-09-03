// backend/Controllers/AuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password, profileType, interests, skills, dateOfBirth } = req.body;
        
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User already exists, you can log in', success: false });
        }
        
        // Convert comma-separated strings to arrays properly
        const interestsArray = interests && interests.trim() !== '' 
            ? (typeof interests === 'string' 
                ? interests.split(',').map(item => item.trim()).filter(item => item !== '')
                : interests)
            : [];
        
        const skillsArray = skills && skills.trim() !== '' 
            ? (typeof skills === 'string' 
                ? skills.split(',').map(item => item.trim()).filter(item => item !== '')
                : skills)
            : [];
        
        // Set default date of birth if not provided
        let dob;
        if (dateOfBirth) {
            dob = new Date(dateOfBirth);
            // Check if date is valid
            if (isNaN(dob.getTime())) {
                dob = new Date('2009-08-19T18:30:00.000Z');
            }
        } else {
            dob = new Date('2009-08-19T18:30:00.000Z');
        }
        
        // Create user object in the desired field order
        const userData = {
            name,
            email,
            password: await bcrypt.hash(password, 10),
            profileType,
            interests: interestsArray,
            skills: skillsArray,
            profilePic: "https://placehold.co/150x150",
            badges: [],
            createdAt: new Date(),
            dateOfBirth: dob,
            isVerified: true,
            lastActive: new Date(),
            parentalConsent: {
                consented: true,
                parentEmail: "",
                consentedAt: new Date()
            },
            points: 0,
            rating: 0,
            reviewCount: 0,
            sessionPreferences: {
                virtual: true,
                inPerson: false
            }
        };
        
        const userModel = new UserModel(userData);
        await userModel.save();
        
        res.status(201).json({
            message: "Signup successful",
            success: true
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
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
        
        // Update last active
        user.lastActive = new Date();
        await user.save();
        
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
                name: user.name,
                profileType: user.profileType
            })
    } catch (err) {
        console.error("Login error:", err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

const getProfile = async (req, res) => {
    try {
      // Use req.user._id from the JWT token to find the user
      const user = await UserModel.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
      }
      res.status(200).json({ success: true, user });
    } catch (err) {
      console.error("Get profile error:", err);
      res.status(500).json({ 
        message: "Internal server error", 
        success: false,
        error: err.message 
      });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, profileType, interests, skills, profilePic, dateOfBirth, sessionPreferences } = req.body;

        console.log("Received update data:", req.body);

        const updateData = {
            name, 
            profileType, 
            profilePic,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            sessionPreferences: sessionPreferences || {
                virtual: true,
                inPerson: false
            }
        };
        
        // Handle interests
        if (interests) {
            updateData.interests = Array.isArray(interests) ? interests : 
                interests.split(',').map(item => item.trim()).filter(item => item !== '');
        }
        
        // Handle skills
        if (skills) {
            updateData.skills = Array.isArray(skills) ? skills : 
                skills.split(',').map(item => item.trim()).filter(item => item !== '');
        }

        // Ensure sessionPreferences is properly structured
        if (sessionPreferences) {
            updateData.sessionPreferences = {
                virtual: !!sessionPreferences.virtual,
                inPerson: !!sessionPreferences.inPerson
            };
        }

        console.log("Processed update data:", updateData);

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.json({ 
            success: true, 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error updating profile", 
            error: error.message 
        });
    }
};


module.exports = {
    signup,
    login,
    getProfile,
    updateProfile
};