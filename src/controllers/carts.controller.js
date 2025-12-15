import cartsService from '../services/carts.service.js';

class CartsController {

    async getCartById(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartsService.getCartById(cid);
            res.status(200).json({ status: 'success', payload: cart });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') || error.message.includes('ID de carrito inválido') ? 404 : 500;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;
        
        if (req.user.role === 'user' && req.user.cart.toString() !== cid) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'No tienes permisos para modificar este carrito.' 
            });
        }
        
        try {
            const updatedCart = await cartsService.addProductToCart(cid, pid, quantity);
            res.status(200).json({ 
                status: 'success', 
                message: `Producto ${pid} agregado al carrito ${cid}.`,
                payload: updatedCart
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') || error.message.includes('ID inválido') ? 404 : 400;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }

    async finalizePurchase(req, res) {
        const { cid } = req.params;
        const userEmail = req.user.email; 

        if (req.user.role === 'user' && req.user.cart.toString() !== cid) {
             return res.status(403).json({ 
                status: 'error', 
                message: 'No tienes permisos para finalizar la compra de este carrito.' 
            });
        }
        
        try {
            const result = await cartsService.finalizePurchase(cid, userEmail);
            
            if (result.ticket) {
                const status = result.failedProducts.length > 0 ? 206 : 200;
                
                return res.status(status).json({
                    status: 'success',
                    message: result.message,
                    ticket: result.ticket,
                    products_not_processed: result.failedProducts
                });
            } else {

                return res.status(400).json({
                    status: 'error',
                    message: result.message || 'La compra no pudo ser procesada. El carrito quedó vacío o sin stock.'
                });
            }
            
        } catch (error) {
            const statusCode = error.message.includes('ID de carrito inválido') || error.message.includes('no encontrado') ? 404 : 500;
            
            res.status(statusCode).json({
                status: 'error',
                message: `Error al procesar la compra: ${error.message}`
            });
        }
    }

    async clearCart(req, res) {
        const { cid } = req.params;

        if (req.user.role === 'user' && req.user.cart.toString() !== cid) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'No tienes permisos para modificar este carrito.' 
            });
        }
        
        try {
            const updatedCart = await cartsService.clearCart(cid);
            res.status(200).json({ 
                status: 'success', 
                message: `Carrito ${cid} vaciado completamente.`,
                payload: updatedCart
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') || error.message.includes('ID inválido') ? 404 : 400;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }

}

export default new CartsController();