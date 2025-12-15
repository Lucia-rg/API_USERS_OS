import express from 'express';
import { isAdmin, isOwnerOrAdmin } from '../middlewares/authorization.js';
import sessionsController from '../controllers/sessions.controller.js';

const router = express.Router();

// USERS
router.get('/', 
  isAdmin, 
  sessionsController.getAllUsers
);
router.get('/id/:id',
  isOwnerOrAdmin('id'),
  sessionsController.getUserById
);
router.put('/:id', 
  isOwnerOrAdmin('id'),
  sessionsController.updateUser
);
router.delete('/:id',
  isAdmin,
  sessionsController.deleteUser
);
router.get('/email/:email',
  isAdmin,
  sessionsController.getUserByEmail
);
router.delete('/email/:email',
  isAdmin,
  sessionsController.deleteUserByEmail
);

export default router;

