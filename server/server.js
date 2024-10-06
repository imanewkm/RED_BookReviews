const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js');
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Use environment variables for sensitive info
require('dotenv').config();

// Configure session middleware
app.use(session({
    secret: Process.env.SESSION_SECRET || "default_secret",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for customer routes
app.use("/customer/auth/*", (req, res, next) => {

    // Check if user is logged in and has a valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, process.env.JWT_SECRET || "access", (err, user) => {
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

// User customer routes for authenticated user actions
app.use("/customer", customer_routes);

// User general routes for public API endpoints
app.use("/", genl_routes);

// Use general routes for public API endpoints
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log('Server is running on port ${PORT}'));