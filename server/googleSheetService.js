const { google } = require('googleapis');
require('dotenv').config();

// Load client secrets from a local file
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SHEET_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create an instance of the Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Helper function to read data from a specific sheet
const readSheet = async (spreadsheetId, range) => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    return response.data.values;
};

// Get all books from 'booksdb' sheet
const getBooks = async () => {
    const booksData = await readSheet(process.env.BOOKS_SHEET_ID, 'booksdb!A2:F');
    return booksData.map(row => ({
        isbn: row[0],
        title: row[1],
        author: row[2],
        genre: row[3],
        year: row[4],
        reviews: JSON.parse(row[5] || '{}')
    }));
};

// Get all users from 'usersdb' sheet
const getUsers = async () => {
    const usersData = await readSheet(process.env.USERS_SHEET_ID, 'usersdb!A2:D');
    return usersData.map(row => ({
        username: row[0],
        password: row[1], // Hashed password
        email: row[2],
        fullName: row[3],
    }));
};

module.exports = { getBooks, getUsers };