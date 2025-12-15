import express from 'express';
import passport from 'passport';
import sessionsController from '../controllers/sessions.controller.js';

const router = express.Router();

// Rutas de autenticación
// Register
router.post('/register', sessionsController.register);
// Login
router.post('/login', 
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400).render('login', { 
          error: info?.message || 'Credenciales inválidas',
          email: req.body.email 
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  sessionsController.login
);

// RUTAS CON JWT
// Current
router.get('/current', 
    passport.authenticate('current', { session: false }),
    sessionsController.getCurrentUser);
// Logout
router.get('/logout', sessionsController.logout);
router.post('/logout', sessionsController.logout);

export default router;
