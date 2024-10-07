const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let books = require("./booksdb.js");
const regd_users = express.Router();
require('dotenv').config();

let users = [];

// Helper function for token validation
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

// Use bcrypt for password hashing
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user && bcrypt.compareSync(password, user.password);
};

// login for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required "});
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your_jwt_secret', {expiresIn: '1hr' });
    return res.status(200).json({ message: "Login successful", token });
});

// Add a review with token verification
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "Token is required" });

    try {
        const { username } = verifyToken(token);

        if (!books[isbn].review) books[isbn].reviews = {};
        books[isbn].reviews[username] = review;

        return res.status(200).json({ message: "Review added/modified successfully" });
    } catch (err) {
        return res.status(401).json({ message: "Invalide token" });
    }
});

// Delete a review with token verification
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }
    try {
        const { username } = verifyToken(token);

        if (!books[isbn] || !books[isbn].reviews || !books[isbn].review[username]) {
            return res.status(404).json({ message: "Review not found" });
        }

        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});