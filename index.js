const express = require('express');

const app = express();

app.get('/', (req, res) => {
    console.log(req);
    res.status(200).json({
        status: 'success',
        data: 'Hello from server'
    });
});



const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}...`)
})

