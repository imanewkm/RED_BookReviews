const express = require('express');
const bcrypt = require('bcrypt');
const generalRouter = express.Router();
const books = require('./booksdb.js'); // Assuming books are stored in booksdb.js
let users = require("./auth_users.js").users; // Get users from auth_users.js

// Example route for getting books (removed duplicate definition)
generalRouter.get('/books', (req, res) => {
    try {
        res.status(200).json(books); // Respond with the list of books
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// Register a new user
generalRouter.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully" });
});

// Get book details by ISBN
generalRouter.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details by author
generalRouter.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get book details by title
generalRouter.get('/books/title/:title', (req, res) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Get reviews for a book by ISBN
generalRouter.get('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});

// Export router
module.exports = generalRouter;
