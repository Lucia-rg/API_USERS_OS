import express from 'express';
import { isAdmin, isAdminOrUser } from '../middlewares/authorization.js';
import productsController from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', 
    isAdminOrUser, 
    productsController.getProducts
);
router.post('/', 
    isAdmin, 
    productsController.createProduct
);
router.put('/:pid', 
    isAdmin, 
    productsController.updateProduct
);
router.delete('/:pid', 
    isAdmin, 
    productsController.deleteProduct
);

export default router;