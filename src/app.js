/**
 * @file src/app.js
 * @description Entry point for the Express application with improved error handling and validation.
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
app.use(cors({ origin: '*' })); // Enable CORS for all origins during development
app.use(helmet()); // Secure HTTP headers

// Custom HTTP request logger middleware using morgan with a custom format
morgan.token('date', () => new Date().toISOString());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms [:date[clf]]'));

/**
 * Route definitions
 */

// Example API route with validation and edge-case handling
app.get('/api/hello', (req, res) => {
  try {
    const name = req.query.name || 'World';
    
    if (!name) {
      throw new Error('Name parameter is required');
    }

    res.json({ message: `Hello ${name}!` });
  } catch (err) {
    console.error(err.stack);
    res.status(400).send({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;