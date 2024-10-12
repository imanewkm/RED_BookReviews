const express = require('express');
const bcrypt = require('bcrypt');
const { getBooks, getUsers, addUser } = require('../services/googleSheetService');
const generalRouter = express.Router();

// Load users from Google Sheets
const loadUsers = async () => {
    return await getUsers(); // Fetch users from Google Sheets
};

// Get all books
generalRouter.get('/books', async (req, res) => {
    try {
        const books = await getBooks(); // Fetch books from Google Sheets
        res.status(200).json(books);
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

    const users = await loadUsers(); // Fetch users from Google Sheets

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Add the new user to Google Sheets
    await addUser({ username, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully" });
});

// Get book details by ISBN
generalRouter.get('/books/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const books = await getBooks(); // Fetch books from Google Sheets
    const book = books.find(b => b.isbn === isbn);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details by author
generalRouter.get('/books/author/:author', async (req, res) => {
    const { author } = req.params;
    const books = await getBooks(); // Fetch books from Google Sheets
    const booksByAuthor = books.filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Get book details by title
generalRouter.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;
    const books = await getBooks(); // Fetch books from Google Sheets
    const booksByTitle = books.filter(book => book.title === title);

    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Get reviews for a book by ISBN
generalRouter.get('/books/review/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const books = await getBooks(); // Fetch books from Google Sheets
    const book = books.find(b => b.isbn === isbn);

    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});

// Export router
module.exports = generalRouter;
