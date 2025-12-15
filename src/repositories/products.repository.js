import productsDAO from "../dao/products.dao.js";

class ProductsRepository {

    async getAll(query = {}) {
        return await productsDAO.findAllProducts(query); 
    }

    async getById(pid) {
        return await productsDAO.getProductById(pid);
    }

    async create(productData) {
        return await productsDAO.createProduct(productData);
    }

    async update(pid, updateData) {
        return await productsDAO.updateProduct(pid, updateData);
    }

    async updateStock(pid, quantityToSubtract) {
        return await productsDAO.updateProductStock(pid, quantityToSubtract);
    }

    async delete(pid) {
        return await productsDAO.deleteProduct(pid);
    }

}

export default new ProductsRepository();