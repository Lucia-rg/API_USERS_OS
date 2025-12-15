import productsService from '../services/products.service.js';

class ProductsController {

    async getProducts(req, res) {
        try {
            const query = req.query || {}; 
            const result = await productsService.getProducts(query);
            res.status(200).json({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    
    async createProduct(req, res) {
        try {
            const newProduct = await productsService.createProduct(req.body);
            res.status(201).json({ status: 'success', payload: newProduct });
        } catch (error) {
            const statusCode = error.message.includes('código del producto ya existe') ? 409 : 400;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }
    
    async updateProduct(req, res) {
        const { pid } = req.params;
        try {
            const updatedProduct = await productsService.updateProduct(pid, req.body);
            res.status(200).json({ status: 'success', payload: updatedProduct });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') || error.message.includes('ID de producto inválido') ? 404 : 400;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }
    
    async deleteProduct(req, res) {
        const { pid } = req.params;
        try {
            await productsService.deleteProduct(pid);
            res.status(200).json({ status: 'success', message: `Producto ${pid} eliminado correctamente.` });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') || error.message.includes('ID de producto inválido') ? 404 : 400;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }

}

export default new ProductsController();