import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const purchasedProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true }, 
    code: { type: String, required: true },
    originalProductId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: [1, 'La cantidad debe ser al menos 1.'],
    },
    subtotal: { 
        type: Number, 
        required: true 
    }
}, { _id: false });

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4().replace(/-/g, '').toUpperCase()
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'El monto total no puede ser negativo']
    },
    purchaser: {
        type: String,
        required: true
    },
    products: {
        type: [purchasedProductSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'El ticket debe contener al menos un producto.'
        }
    }
}, { 
    timestamps: true
});

ticketSchema.methods.toJSON = function() {
    const ticket = this.toObject();
    ticket.id = ticket._id.toString();
    delete ticket._id;
    delete ticket.__v;
    return ticket;
};

export default mongoose.model('Ticket', ticketSchema);