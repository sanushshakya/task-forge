/**
 * @file src/app.js
 * @description Entry point for the Express application.
 */

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// Create an Express application instance
const app = express();

/**
 * Middleware setup
 */
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(morgan('combined')); // HTTP request logger middleware

/**
 * Route definitions
 */

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;