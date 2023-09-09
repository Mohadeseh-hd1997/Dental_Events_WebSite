const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3005;

app.get('/proxy', async (req, res) => {
    try {
        const response = await fetch('https://www.aparat.com/Mohadeseh_hd1997/live');
        const data = await response.text();
        res.send(data);

    } catch (error) {
        console.error('Error occurred while proxying request:', error);
        res.status(500).send('Error occurred while proxying request');
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on port ${port}`);
});
