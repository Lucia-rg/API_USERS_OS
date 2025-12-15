import Product from '../models/product.model.js';

class ProductsDAO {

    async findAllProducts(query = {}) {
        try {
            return await Product.find(query).lean(); 
        } catch (error) {
            throw new Error(`Error obteniendo todos los productos: ${error.message}`);
        }
    }

    async getProductById(pid) {
        try {
            const product = await Product.findById(pid);
            if (!product) {
                throw new Error('Producto no encontrado.');
            }
            return product; 
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error(`ID de producto inválido.`);
            }
            throw new Error('Error obteniendo el producto: ', error.message);  
        }
    }

    async createProduct(productData) {
        try {
            const codeExist = await Product.findOne({code: productData.code});

            if (codeExist) {
            throw new Error('El código del producto ya existe en la base de datos.');  
            }

            const newProduct = new Product(productData);
            return await newProduct.save();
            
        } catch (error) {
            throw new Error('Error creando producto: ', error.message);
        }
    }

    async updateProduct(pid, updatedFields){
        try {

            if (updatedFields.id || updatedFields._id) {
                throw new Error('No se puede actualizar el ID del producto.');
            }

            const updatedProduct = Product.findByIdAndUpdate(pid, updatedFields, {new: true, runValidators: true});

            if (!updatedProduct) {
                throw new Error(`Producto no encontrado.`)
            }

            return updatedProduct;
            
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error(`ID de producto inválido.`);
            }
            throw new Error('Error actualizando el producto: ', error.message);     
        }
    }

    async updateProductStock(pid, quantityToSubtract) {
        try {
            const product = await Product.findById(pid);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            
            if (product.stock < quantityToSubtract) {
                return { success: false, currentStock: product.stock }; 
            }

            product.stock -= quantityToSubtract;
            await product.save();
            return { success: true, updatedStock: product.stock };

        } catch (error) {
            throw new Error(`Error actualizando stock de producto: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const product =  await Product.findByIdAndDelete(pid);

            if (!product) {
                throw new Error('Producto no encontrado.');
            }

            return pid;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error(`ID de producto inválido.`);
            }
            throw new Error('Error eliminando el producto: ', error.message);    
        }  
    }

}

export default new ProductsDAO();
