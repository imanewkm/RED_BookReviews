require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const authRoutes = require('./router/auth_users'); // Correctly importing auth_users
const generalRouter = require('./router/general'); // Importing general router

const app = express();
app.use(express.json()); // Middleware to parse JSON data

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for customer routes
app.use("/customer/auth/*", (req, res, next) => {
    // Check if user is logged in and has a valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, user) => {
            if (!err) {
                req.user = user; // Store user information in the request
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// User routes
app.use('/auth', authRoutes); // Auth routes for login and user management
app.use('/api', generalRouter); // General routes for public API endpoints

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // Fixed template literal
