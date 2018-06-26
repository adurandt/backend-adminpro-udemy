// Entry point app.js

// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Initialize variables
var app = express();

// To avoid DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated
mongoose.Promise = global.Promise;

// Body Parser Midleware
// parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Routes Import
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

// DB Connect
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Database: \x1b[32m%s\x1b[0m', 'online');

});


// Routes Middleware (run after resolve other routes)
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Listen to request
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online')
});