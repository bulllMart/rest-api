const express = require('express');

const NSEArchive = require('./src/archive');
const NSELive = require('./src/nseLive');

const app = express();
const port = process.env.PORT || 3000;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use(express.json());


const nseLive = new NSELive();


async function checkMarketStatus(req, res, next) {
    try {
        const marketStatusData = await nseLive.marketStatus(); 

        
        const isMarketOpen = marketStatusData?.marketState?.some(
            state => state.marketStatus.toLowerCase() === 'open'
        );

        req.marketStatus = isMarketOpen ? 'open' : 'closed'; 
        next(); 
    } catch (error) {
        next(error); 
    }
}



// Route 1: Fetch all indices data
app.get('/api/allIndices', checkMarketStatus, async (req, res, next) => {
    try {
        const indicesData = await nseLive.allIndices(); 

        res.json({
            success: true,
            marketStatus: req.marketStatus, 
            data: indicesData,
        });
    } catch (error) {
        next(error); 
    }
});


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'API is running smoothly' });
});


app.use((err, req, res, next) => {
    console.error('Error:', err.message || err); 
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong',
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
