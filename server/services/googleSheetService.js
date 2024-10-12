const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load client secrets from a local file
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create an instance of the Sheets API
const sheets = google.sheets({ version: 'v4', auth });

const readSheet = async (spreadsheetId, range) => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    return response.data.values;
};

// Update rows in the sheet
const writeSheet = async (spreadsheetId, range, values) => {
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
            values,
        },
    });
};

// Fetch all books from the google Sheets
const getBooks = async () => {
    const booksData = await readSheet(process.env.BOOKS_SHEET_ID, 'Sheet1!A2:F');
    return booksData.map(row => ({
        isbn: row[0],
        title: row[1],
        author: row[2],
        genre: row[3],
        year: row[4],
        reviews: JSON.parse(row[5] || '{}')
    }));
};

// Fetch all users from the Google Sheet
const getUsers = async () => {
    const usersData = await readSheet(process.env.USERS_SHEET_ID, 'Sheet1!A2:D');
    return usersData.map(row => ({
        username: row[0],
        password: row[1], // Hashed password
        email: row[2],
        fullName: row[3],
    }));
};

// Add a new user to the Google Sheet
const addUser = async (newUser) => {
    const { username, password, email, fullName } = newUser;
    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.USERS_SHEET_ID,
        range: 'userdb!A2:D', // Appends the new user to the bottom of the sheet
        valueInputOption: 'RAW',
        resource: {
            values: [
                [username, password, email, fullName]
            ]
        }
    });
};

// Update book reviews in the Google Sheet
const updateBookReviews = async (isbn, updatedReviews) => {
    const books = await getBooks();
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    if (bookIndex === -1) {
        throw new Error("Book not found");
    }

    const reviewsString = JSON.stringify(updatedReviews);
    const range = `booksdb!F${bookIndex = 2}`; // F column for reviews, row starts at 2
    await writeSheet(process.env.BOOKS_SHEET_ID, range, [[reviewsString]]);
};

module.exports = { getBooks, getUsers, addUser, updateBookReviews };