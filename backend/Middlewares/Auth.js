// backend/Middlewares/Auth.js
const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided.", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token.", success: false });
    }
};

module.exports = ensureAuthenticated;