var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var User = require('../models/user');


// User Routes

// Get all users
app.get('/', (req, res, next) => {

    User.find({}, 'name email img role')
        .exec((err, users) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al cargar usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                users: users
            });

        });

});


// Update a user
app.put('/:id', mdAuthentication.tokenVerify, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con id ' + id + ' no existe',
                errors: { message: 'No existe usuario con ese ID' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, updateUser) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: err
                });
            }

            updateUser.password = ':)';

            res.status(200).json({
                ok: true,
                user: updateUser
            });

        });

    });

});



// Create a new user
app.post('/', mdAuthentication.tokenVerify, (req, res) => {

    body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, newUser) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: newUser,
            tokenUser: req.user
        });

    });

});





// Delete a user by id
app.delete('/:id', mdAuthentication.tokenVerify, (req, res) => {

    var id = req.params.id;
    User.findByIdAndRemove(id, (err, deleteUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar usuario',
                errors: err
            });
        }

        if (!deleteUser) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con id ' + id + ' no existe',
                errors: { message: 'No existe usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            user: deleteUser
        });

    })

});

module.exports = app;