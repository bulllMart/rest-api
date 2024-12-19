const express = require('express');
const cors = require('cors');
const NSEArchive = require('./src/archive');
const NSELive = require('./src/nseLive');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));
app.use(express.json()); // For parsing JSON request bodies


const nseLive = new NSELive();

// Route 1: Fetch all indices data
app.get('/api/allIndices', async (req, res, next) => {
	try {
		const data = await nseLive.allIndices();
		res.json(data);
	} catch (error) {
		next(error); // Pass error to error handler
	}
});

// Route 2: Health Check for readiness
app.get('/api/health', (req, res) => {
	res.status(200).json({ status: 'UP', message: 'API is running smoothly' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
	console.error('Error:', err.message);
	res.status(500).json({
		error: 'Internal Server Error',
		message: err.message || 'Something went wrong',
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
