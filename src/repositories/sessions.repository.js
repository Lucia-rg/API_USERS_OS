import sessionsDAO from '../dao/sessions.dao.js';

class SessionsRepository {

    async create(userData) {
        return await sessionsDAO.createUser(userData);
    }

    async findAll() {
        return await sessionsDAO.findAllUsers();
    }

    async findByEmail(email) {
        return await sessionsDAO.findUserByEmail(email);
    }

    async findById(id) {
        return await sessionsDAO.findUserById(id);
    }

    async update(id, updateData) {
        return await sessionsDAO.updateUser(id, updateData);
    }

    async delete(id) {
        return await sessionsDAO.deleteUser(id);
    }

    async deleteByEmail(email) {
        return await sessionsDAO.deleteUserByEmail(email);
    }

    async findByResetToken(token) {
        return await sessionsDAO.findByResetToken(token);
    }

}

export default new SessionsRepository();