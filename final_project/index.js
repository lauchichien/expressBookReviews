
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books = require('./router/booksdb.js');

const app = express();

app.use(express.json());

// Internal API for Axios requests
app.get('/internal/books', (req, res) => {
    res.json(books);
});

app.get('/internal/books/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (book) {
        return res.status(200).json(book);
    }

    return res.status(404).json({
        message: 'Book not found'
    });
});

app.get('/internal/books/author/:author', (req, res) => {
    const author = req.params.author;

    const result = Object.values(books).filter(
        book => book.author === author
    );

    return res.status(200).json(result);
});

app.get('/internal/books/title/:title', (req, res) => {
    const title = req.params.title;

    const result = Object.values(books).filter(
        book => book.title === title
    );

    return res.status(200).json(result);
});

// Customer session
app.use(
    '/customer',
    session({
        secret: 'fingerprint_customer',
        resave: true,
        saveUninitialized: true
    })
);

// Authentication middleware
app.use('/customer/auth/*', function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;

        jwt.verify(token, 'access', function (err, user) {
            if (!err) {
                req.user = user;
                return next();
            }

            return res.status(403).json({
                message: 'User not authenticated'
            });
        });
    } else {
        return res.status(403).json({
            message: 'User not logged in'
        });
    }
});

const PORT = 5000;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));
