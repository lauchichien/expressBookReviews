
const express = require('express');
const axios = require('axios');

let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'User already exists!'
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Task 10: Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/internal/books'
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: 'Error retrieving books'
        });
    }
});

// Task 11: Get book by ISBN using Axios and async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/internal/books/isbn/${encodeURIComponent(req.params.isbn)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: 'Book not found'
        });
    }
});

// Task 12: Get books by author using Axios and async/await
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/internal/books/author/${encodeURIComponent(req.params.author)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: 'Error retrieving books by author'
        });
    }
});

// Task 13: Get books by title using Axios and async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/internal/books/title/${encodeURIComponent(req.params.title)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(error.response?.status || 500).json({
            message: 'Error retrieving books by title'
        });
    }
});

// Task 5: Get book reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: 'Book not found'
    });
});

module.exports.general = public_users;
