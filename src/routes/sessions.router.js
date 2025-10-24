const express = require('express');
const sessionsController = require('../controllers/sessions.controller');

const router = express.Router();

// Middleware de autenticación
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Rutas de autenticación

router.post('/register', sessionsController.register);