const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// =====================================================
// INTERNAL API ROUTES FOR AXIOS
// =====================================================

// Get all books
public_users.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/api/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Get books by author
public_users.get('/api/books/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = {};

  Object.keys(books).forEach((key) => {
    if (
      books[key].author.toLowerCase() ===
      author.toLowerCase()
    ) {
      booksByAuthor[key] = books[key];
    }
  });

  return res.status(200).json(booksByAuthor);
});

// Get books by title
public_users.get('/api/books/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = {};

  Object.keys(books).forEach((key) => {
    if (
      books[key].title.toLowerCase() ===
      title.toLowerCase()
    ) {
      booksByTitle[key] = books[key];
    }
  });

  return res.status(200).json(booksByTitle);
});


// =====================================================
// REGISTER USER
// =====================================================

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});


// =====================================================
// TASK 10
// GET ALL BOOKS USING AXIOS + ASYNC/AWAIT
// =====================================================

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/books'
    );

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// =====================================================
// TASK 11
// GET BOOK BY ISBN USING AXIOS + ASYNC/AWAIT
// =====================================================

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(
      `http://localhost:5000/api/books/isbn/${isbn}`
    );

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});


// =====================================================
// TASK 12
// GET BOOKS BY AUTHOR USING AXIOS + ASYNC/AWAIT
// =====================================================

public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const response = await axios.get(
      `http://localhost:5000/api/books/author/${encodeURIComponent(author)}`
    );

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// =====================================================
// TASK 13
// GET BOOKS BY TITLE USING AXIOS + ASYNC/AWAIT
// =====================================================

public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const response = await axios.get(
      `http://localhost:5000/api/books/title/${encodeURIComponent(title)}`
    );

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// =====================================================
// GET BOOK REVIEW
// =====================================================

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


module.exports.general = public_users;