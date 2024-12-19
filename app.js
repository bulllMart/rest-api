const express = require('express');
const cors = require('cors');
const NSEArchive = require('./src/archive');
const NSELive = require('./src/nseLive');

const app = express();
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(cors({
    origin: '*', // Allow all origins (for development; limit in production)
    methods: ['GET', 'POST', 'PUT'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
}));

// JSON Parsing Middleware
app.use(express.json());

// Instantiate NSELive class
const nseLive = new NSELive();

// Route 1: Fetch all indices data
app.get('/api/allIndices', async (req, res, next) => {
    try {
        const data = await nseLive.allIndices();
        res.json({ success: true, data });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
});

// Route 2: Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'API is running smoothly' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err); // Log full error in console
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong',
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
