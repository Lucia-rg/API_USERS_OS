import Cart from '../models/cart.model.js';
import mongoose from 'mongoose';

class CartsDAO {

    async createCart() {
        try {
            return await Cart.create({ products: [] });
        } catch (error) {
            throw new Error(`Error creando el carrito: ${error.message}.`);  
        }
    }

    async getCartById(cid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            return cart;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID del carrito inválido.');
            }
            throw new Error(`Error obteniendo el carrito: ${error.message}.`);    
        }
    }

    async updateCartProducts(cid, productsArray) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(
                cid,
                { $set: { products: productsArray } },
                { new: true, runValidators: true }
            );
            
            if (!updatedCart) {
                throw new Error('Carrito no encontrado para actualizar.');
            }
            
            return updatedCart;
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                throw new Error('ID de carrito inválido.');
            }
            throw new Error(`Error en DAO actualizando productos del carrito: ${error.message}`);
        }
    }

    async clearCart(cid) {
        try {
            const clearedCart = await Cart.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { new: true }
            );

            if (!clearedCart) {
                throw new Error('Carrito no encontrado para vaciar.');
            }

            return clearedCart;
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                throw new Error('ID de carrito inválido.');
            }
            throw new Error(`Error en DAO vaciando carrito: ${error.message}`);
        }
    }

}

export default new CartsDAO();