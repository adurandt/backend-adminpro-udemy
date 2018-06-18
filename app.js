// Entry point app.js

// Requires
var express = require('express');
var mongoose = require('mongoose');

// Initialize variables
var app = express();

// DB Connect
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Database: \x1b[32m%s\x1b[0m', 'online');

});

// Routes
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente'
    });

});




// Listen to request
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online')
});