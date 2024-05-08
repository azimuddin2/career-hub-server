const express = require('express');
const app = express();
const port = 5000;


app.get('/', (req, res) => {
    res.send('Career Hub Server App Runing');
});

app.listen(port, () => {
    console.log(`Career Hub app listening on port ${port}`)
});