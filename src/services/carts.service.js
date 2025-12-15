import cartsRepository from "../repositories/carts.repository.js";
import productsRepository from "../repositories/products.repository.js";
import ticketsRepository from "../repositories/tickets.repository.js";

class CartsService {

    async getCartById(cid) {
        try {
            const cart = await cartsRepository.getById(cid);
            if (!cart) {
                throw new Error(`Carrito con ID ${cid} no encontrado.`);
            }
            return cart;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID de carrito inválido.');
            }
            throw new Error(`Error en servicio obteniendo carrito: ${error.message}`);
        }
    }

    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const product = await productsRepository.getById(pid);
            const cart = await this.getCartById(cid);
            const productIndex = cart.products.findIndex(
                item => (item.product.id || item.product._id).toString() === pid
            );

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    product: pid,
                    quantity: quantity
                });
            }
            
            const updatedCart = await cartsRepository.updateProducts(cid, cart.products);
            return updatedCart;
            
        } catch (error) {
            throw new Error(`Error añadiendo producto al carrito: ${error.message}`);
        }
    }

    async finalizePurchase(cid, userEmail) {
        let cart;
        try {
            cart = await this.getCartById(cid);
            
            const productsToBuy = [];
            const productsToKeep = [];
            let totalAmount = 0;
            
            for (const item of cart.products) {
                const productId = item.product.id || item.product._id;
                const requiredQuantity = item.quantity;

                const stockResult = await productsRepository.updateStock(productId, requiredQuantity);

                if (stockResult.success) {
                    const subtotal = item.product.price * requiredQuantity;
                    productsToBuy.push({
                        title: item.product.title,
                        price: item.product.price,
                        code: item.product.code,
                        originalProductId: productId,
                        quantity: requiredQuantity,
                        subtotal: subtotal
                    });
                    totalAmount += subtotal;
                } else {
                    productsToKeep.push({
                        product: productId,
                        quantity: requiredQuantity
                    });
                }
            }
            
            if (productsToBuy.length === 0) {
                return { 
                    ticket: null, 
                    failedProducts: cart.products.map(p => p.product.toString()),
                    message: "No se pudo procesar la compra. Ningún producto tenía stock suficiente."
                };
            }
            
            const ticketData = {
                amount: totalAmount,
                purchaser: userEmail,
                products: productsToBuy
            };
            const newTicket = await ticketsRepository.create(ticketData);
            
            const failedProductIds = productsToKeep.map(p => p.product.toString());
            await cartsRepository.updateProducts(cid, productsToKeep);

            return {
                ticket: newTicket,
                failedProducts: failedProductIds,
                message: `Compra procesada. Se generó el ticket ${newTicket.code}. ${failedProductIds.length} productos no pudieron comprarse por falta de stock.`
            };
            
        } catch (error) {
            throw new Error(`Error en servicio de compra: ${error.message}`);
        }
    }

    async clearCart(cid) {
        try {
            return await cartsRepository.clear(cid);
        } catch (error) {
            throw new Error(`Error en servicio vaciando carrito: ${error.message}`);
        }
    }

}

export default new CartsService();