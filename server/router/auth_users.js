const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUsers, addUser } = require('../services/googleSheetService');
const regd_users = express.Router();
require('dotenv').config();

let usersCache = null;

const loadUsers = async () => {
    if (!usersCache) {
        usersCache = await getUsers(); // Load users from Google Sheets
    }
    return usersCache;
};

// Helper function for token validation
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
};

// Login for registered users
regd_users.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const users = await loadUsers();
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
});

// Register a new user (sign-up)
regd_users.post("/register", async (req, res) => {
    const { username, password, email, fullName } = req.body;

    if (!username || !password || !email || !fullName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const users = await loadUsers();
    const existingUser = users.find(u => u.username === username || u.email === email);

    if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Add the new user to Google Sheets
    await addUser({ username, password: hashedPassword, email, fullName });

    return res.status(201).json({ message: "User registered successfully" });
});

// Add a review with token verification
regd_users.put("/review/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "Token is required" });

    try {
        const { username } = verifyToken(token);
        const books = await getBooks();
        const book = books.find(b => b.isbn === isbn);

        if (!book.reviews) {
            book.reviews = {};
        }

        book.reviews[username] = review;

        // Update book reviews in Google Sheets
        await updateBookReviews(isbn, book.reviews);

        return res.status(200).json({ message: "Review added/modified successfully" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

// Delete a review with token verification
regd_users.delete("/review/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }

    try {
        const { username } = verifyToken(token);
        const books = await getBooks();
        const book = books.find(b => b.isbn === isbn);

        if (!book || !book.reviews || !book.reviews[username]) {
            return res.status(404).json({ message: "Review not found" });
        }

        delete book.reviews[username];

        // Update book reviews in Google Sheets
        await updateBookReviews(isbn, book.reviews);

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

module.exports = regd_users;
