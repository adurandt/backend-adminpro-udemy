var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();

var User = require('../models/user');
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: { message: 'Credenciales incorrectas' }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: { message: 'Credenciales incorrectas' }
            });
        }

        // Create a token
        userDB.password = ':)';
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 hrs


        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });
    });

});




module.exports = app;