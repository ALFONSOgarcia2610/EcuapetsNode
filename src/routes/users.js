const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { authenticate } = require('passport');
const { isAuthenticated } = require('../helpers/auth');
const user = require('../models/user');

router.get('/users/signin', (req, res) => {
    res.render('usuario/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true
}));
router.get('/users/signup', (req, res) => {
    res.render('usuario/signup');
});
router.post('/users/signup', async (req, res) => {
    const {nombre, apellido, email, password, confirm_password,  genero, provincia, canton, c1, c2, tel1, tel2   } = req.body;
    const errors = [];
    if (password != confirm_password) {
        errors.push({ Text: 'Las contraseñas no Coinciden' });
    }
    if (password.length < 8) {
        errors.push({ Text: 'La contraseña debe de incluir mas de 7 caracteres' });
    }
    if (errors.length > 0) {
        res.render('usuario/signup', { errors, nombre, email, password, confirm_password });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('success_msg', 'El correo electronico digitado ya se encuentra en uso');
            res.redirect('/users/signin');
        } else {
            const newUser = new User({ nombre, apellido, email, password, genero, provincia, canton, c1, c2, tel1, tel2  });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Registro Exitoso');
            res.redirect('/users/signin');
        }
    }
});
router.get('/usuario/edit/:id', isAuthenticated, async (req, res) => {
    const usuario = await user.findById(req.params.id).lean();
    res.render('usuario/edit-user', { usuario});
});
router.put('/usuario/edit-user/:id', async (req, res) => {
    const { nombre, apellido, email, provincia, canton, c1, c2, tel1, tel2 } = req.body;
    await user.findByIdAndUpdate(req.params.id, {provincia, canton, c1, c2, tel1, tel2 });
        req.flash('success_msg', 'Usuario Actualizado Satisfactoriamente');
        res.redirect('/');
});
router.get('/users/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
module.exports = router;