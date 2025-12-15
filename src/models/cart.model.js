import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'La cantidad debe ser al menos 1.'],
                default: 1
            }
        }],
        default: []
    }   
});

// Middleware para traer los datos del producto populados (pre-find)
cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

cartSchema.methods.toJSON = function() {
    const cart = this.toObject();
    cart.id = cart._id;
    delete cart._id;
    delete cart.__v;
    return cart;
};

export default mongoose.model('Cart', cartSchema);