import express from 'express';
import passport from 'passport';
const router = express.Router();

// Middleware de autenticación
const requireAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    })(req, res, next);
};

const redirectIfAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (user) {
            return res.redirect('/products');
        }
        next();
    })(req, res, next);
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
        user: req.user,
        welcomeMessage: `Bienvenido, ${req.user.first_name} ${req.user.last_name}`
    });
});

export default router;