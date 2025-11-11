const sessionsDAO = require('../dao/sessions.dao');
const { hashPassword } = require('../utils/auth.utils');

class SessionsService {

    async registerUser(userData) {
        try {
            const {password, ...user} = userData;
            const hashedPassword = hashPassword(password);
            const role = userData.email === 'adminCoder@coder.com'? 'admin' : 'user';
            const newUser = await sessionsDAO.createUser({
                ...user,
                password: hashedPassword,
                role
            });

            return this._UserResponse(newUser);

        } catch (error) {
            throw new Error(`Error en servicio de registro: ${error.message}`);    
        }
    }

    async getAllUsers() {
        try {
            const users = await sessionsDAO.findAllUsers();
            return users.map(user => this._UserResponse(user));
        } catch (error) {
            throw new Error(`Error obteniendo todos los usuarios: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await sessionsDAO.findUserByEmail(email);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return this._UserResponse(user);
        } catch (error) {
            throw new Error(`Error obteniendo usuario por email: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await sessionsDAO.findUserById(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return this._UserResponse(user);
        } catch (error) {
            throw new Error(`Error obteniendo usuario por ID: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {
            if (userData.password) {
                userData.password = hashPassword(userData.password);
            }
            const updatedUser = await sessionsDAO.updateUser(id, userData);
            return this._UserResponse(updatedUser);    
        } catch (error) {
            throw new Error(`Error actualizando usuario: ${error.message}`);   
        }
    }

    async deleteUser(id) {
        try {
            const deletedUser = await sessionsDAO.deleteUser(id);
            return { 
                message: 'Usuario eliminado correctamente',
                user: this._UserResponse(deletedUser)
            };   
        } catch (error) {
            throw new Error(`Error eliminando usuario: ${error.message}`);  
        }
    }

    async deleteUserByEmail(email) {
        try {
            const deletedUser = await sessionsDAO.deleteUserByEmail(email);
            return { 
                message: 'Usuario eliminado correctamente',
                user: this._UserResponse(deletedUser)
            };   
        } catch (error) {
            throw new Error(`Error eliminando usuario por email: ${error.message}`);  
        }
    }

    _UserResponse(user) {
        if (!user) return null;

        return {
            id: user._id || user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart,
            last_connection: user.last_connection,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}

module.exports = new SessionsService();

