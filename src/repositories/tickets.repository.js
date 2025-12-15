import ticketsDAO from '../dao/tickets.dao.js';

class TicketsRepository {

    async create(ticketData) {
        return await ticketsDAO.createTicket(ticketData);
    }

    async getById(id) {
        return await ticketsDAO.getTicketById(id);
    }

}

export default new TicketsRepository();