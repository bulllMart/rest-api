const express = require('express');
const NSEArchive = require('./src/archive');
const NSELive = require('./src/nseLive');
const app = express();
const port = 3000;

// Initialize the NSELive instance
const nseLive = new NSELive();

// Route 1: Fetch all indices data
app.get('/api/allIndices', async (req, res) => {
	try {
		const data = await nseLive.allIndices();
		res.json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});



// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
