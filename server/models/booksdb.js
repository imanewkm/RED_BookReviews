const { getBooks } = require('../services/googleSheetService');

let books = {};

getBooks().then(data => {
    data.forEach(book => {
        books[book.isbn] = book;
    });
}).catch(err => console.log('Error loading books:', err));

module.exports = { books };