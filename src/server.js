/**
 * @file src/server.js
 * @description Entry point for the HTTP server.
 */

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// Create an Express application instance
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(morgan('combined')); // HTTP request logger middleware

/**
 * Route definitions
 */

// Example API route to demonstrate routing
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

/**
 * Server setup
 */
const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});