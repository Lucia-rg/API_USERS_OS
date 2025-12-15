import sessionsRepository from '../repositories/sessions.repository.js';
import cartsRepository from '../repositories/carts.repository.js';
import { hashPassword } from '../utils/auth.utils.js';
import UserDTO from '../dto/user.dto.js';

class SessionsService {

    async registerUser(userData) {
        try {
            const {password, ...user} = userData;
            const newCart = await cartsRepository.create();
            const hashedPassword = hashPassword(password);
            const role = userData.email === 'adminCoder@coder.com'? 'admin' : 'user';
            const newUser = await sessionsRepository.create({
                ...user,
                password: hashedPassword,
                role,
                cart: newCart._id
            });

            return new UserDTO(newUser);

        } catch (error) {
            throw new Error(`Error en servicio de registro: ${error.message}`);    
        }
    }

    async getAllUsers() {
        try {
            const users = await sessionsRepository.findAll();
            return users.map(user => new UserDTO(user));
        } catch (error) {
            throw new Error(`Error obteniendo todos los usuarios: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await sessionsRepository.findByEmail(email);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return new UserDTO(user);
        } catch (error) {
            throw new Error(`Error obteniendo usuario por email: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await sessionsRepository.findById(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return new UserDTO(user);
        } catch (error) {
            throw new Error(`Error obteniendo usuario por ID: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {
            if (userData.password) {
                userData.password = hashPassword(userData.password);
            }
            const updatedUser = await sessionsRepository.update(id, userData);
            return new UserDTO(updatedUser);  
        } catch (error) {
            throw new Error(`Error actualizando usuario: ${error.message}`);   
        }
    }

    async deleteUser(id) {
        try {
            const deletedUser = await sessionsRepository.delete(id);
            return { 
                message: 'Usuario eliminado correctamente',
                user: new UserDTO(deletedUser)
            };   
        } catch (error) {
            throw new Error(`Error eliminando usuario: ${error.message}`);  
        }
    }

    async deleteUserByEmail(email) {
        try {
            const deletedUser = await sessionsRepository.deleteByEmail(email);
            return { 
                message: 'Usuario eliminado correctamente',
                user: new UserDTO(deletedUser)
            };   
        } catch (error) {
            throw new Error(`Error eliminando usuario por email: ${error.message}`);  
        }
    }
}

export default new SessionsService();

