const express = require('express');
const cors = require('cors');
const ewasteRoutes = require('./routes/ewasteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Add this before your routes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Use only the ewasteRoutes which now includes donation endpoints
app.use('/api/ewaste', ewasteRoutes);

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app; 