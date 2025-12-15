import productsRepository from '../repositories/products.repository.js';

class ProductsService {

    async getProducts(query = {}) {
        try {
            const result = await productsRepository.getAll(query);
            return result;
        } catch (error) {
            throw new Error(`Error en servicio obteniendo productos: ${error.message}`);
        }
    }

    async getProductById(pid) {
        try {
            return await productsRepository.getById(pid);
        } catch (error) {
            throw new Error(`Error en servicio buscando producto: ${error.message}`);
        }
    }
    
    async createProduct(productData) {
        try {
            return await productsRepository.create(productData);
        } catch (error) {
            throw new Error(`Error en servicio creando producto: ${error.message}`);
        }
    }
    
    async updateProduct(pid, updatedFields) {
        try {
            return await productsRepository.update(pid, updatedFields);
        } catch (error) {
            throw new Error(`Error en servicio actualizando producto: ${error.message}`);
        }
    }
    
    async deleteProduct(pid) {
        try {
            return await productsRepository.delete(pid);
        } catch (error) {
            throw new Error(`Error en servicio eliminando producto: ${error.message}`);
        }
    }

}

export default new ProductsService();