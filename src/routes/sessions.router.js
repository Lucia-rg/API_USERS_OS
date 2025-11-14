import express from 'express';
import passport from 'passport';
import sessionsController from '../controllers/sessions.controller.js';

const router = express.Router();

// Middleware de autenticación

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Se requieren permisos de administrador' });
    }
};

const requireOwnerOrAdmin = (req, res, next) => {
    const { id } = req.params;
    if (req.user && (req.user.role === 'admin' || req.user.id === id)) {
        next();
    } else {
        res.status(403).json({ 
        success: false,
        error: 'No tienes permisos para esta acción' 
        });
    }
};

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
// USERS
router.get('/users',
  passport.authenticate('jwt', { session: false }),
  requireAdmin,
  sessionsController.getAllUsers
);
router.get('/users/email/:email',
  passport.authenticate('jwt', { session: false }),
  requireAdmin,
  sessionsController.getUserByEmail
);
router.get('/users/id/:id',
  passport.authenticate('jwt', { session: false }),
  requireOwnerOrAdmin,
  sessionsController.getUserById
);
router.put('/users/:id',
  passport.authenticate('jwt', { session: false }),
  requireOwnerOrAdmin,
  sessionsController.updateUser
);
router.delete('/users/:id',
  passport.authenticate('jwt', { session: false }),
  requireOwnerOrAdmin,
  sessionsController.deleteUser
);
router.delete('/users/email/:email',
  passport.authenticate('jwt', { session: false }),
  requireAdmin,
  sessionsController.deleteUserByEmail
);

export default router;
