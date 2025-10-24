const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware de autenticación
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

const redirectIfAuth = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products');
    }
    next();
};

// Vistas

router.get('/login', redirectIfAuth, (req, res) => {
    res.render('login');
});

router.get('/register', redirectIfAuth, (req, res) => {
    res.render('register');
});

router.get('/products', requireAuth, (req, res) => {
    res.render('products', {
        user: req.session.user,
        welcomeMessaje: `Bienvenido, ${req.session.user.first_name}` 
    })
}) 

// Revisar el welcome para que cambie el bienvenido según el género

module.exports = router;