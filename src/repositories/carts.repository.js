import cartsDAO from '../dao/carts.dao.js';

class CartsRepository {
    
    async create() {
        return await cartsDAO.createCart();
    }

    async getById(cid) {
        return await cartsDAO.getCartById(cid);
    }

    async updateProducts(cid, productsArray) {
        return await cartsDAO.updateCartProducts(cid, productsArray);
    }

    async clear(cid) {
        return await cartsDAO.clearCart(cid);
    }

}

export default new CartsRepository();