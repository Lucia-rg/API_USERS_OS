import express from 'express';
import { isUser, isOwnerOrAdmin } from '../middlewares/authorization.js';
import cartsController from '../controllers/carts.controller.js';

const router = express.Router();

router.get('/:cid',
    isOwnerOrAdmin('cid'),
    cartsController.getCartById
);
router.post('/:cid/product/:pid',
    isUser,
    cartsController.addProductToCart
);
router.post('/:cid/purchase', 
    isUser, 
    cartsController.finalizePurchase
);
router.delete('/:cid', 
    isOwnerOrAdmin('cid'), 
    cartsController.clearCart 
);

export default router;