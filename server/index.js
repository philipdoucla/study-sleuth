const express = require('express');
const passport = require('passport');

const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(5000);
