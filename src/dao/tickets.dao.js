import Ticket from '../models/ticket.model.js';
import mongoose from 'mongoose';

class TicketsDAO {

    async createTicket(ticketData) {
        try {
            const newTicket = new Ticket(ticketData);
            return await newTicket.save();  
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                throw new Error(`Error de validación al crear ticket: ${error.message}`);
            }
            throw new Error(`Error en DAO creando ticket: ${error.message}`);
        }    
    }

    async getTicketById(id) {
        try {
            return await Ticket.findById(id);
        } catch (error) {
            throw new Error(`Error buscando ticket por ID: ${error.message}`);
        }
    }

}

export default new TicketsDAO();