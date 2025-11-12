import User from '../models/user.model.js';

class SessionsDAO {

    async createUser (userData) {
        try {
            const emailExist = await User.findOne({email: userData.email});

            if (emailExist) {
                throw new Error('El usuario ya existe en la base de datos.');  
            }

            const newUser = new User(userData);
            return await newUser.save();   

        } catch (error) {
            throw new Error(`Error creando usuario: ${error.message}`);    
        }
    }
    
    async findAllUsers () {
        try {
            return await User.find({}).select('-password');
        } catch {
            throw new Error(`Error buscando todos los usuarios: ${error.message}`);
        }
    }

    async findUserByEmail (email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error(`Error buscando usuario por email: ${error.message}`);    
        }
    }

    async findUserById (id) {
        try {
            return await User.findById(id).select('-password');
        } catch (error) {
            throw new Error(`Error buscando usuario por ID: ${error.message}`);   
        }
    }

    async updateUser (id, userData) {
        try {

            if (userData.email) {
                const emailExist = await User.findOne({email: userData.email, _id: {$ne: id}});

                if (emailExist) {
                    throw new Error('El email ya está en uso por otro usuario.');
                }
            }

            const { password, ...updateData } = userData;
      
            if (password) {
                updateData.password = password;
            }

            return await User.findByIdAndUpdate(id, updateData, {new: true, runValidators: true}).select('-password');
            
        } catch (error) {
            throw new Error(`Error actualizando usuario: ${error.message}`);  
        }
    }

    async deleteUser (id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error eliminando usuario: ${error.message}`);   
        }
    }

    async deleteUser (id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error eliminando usuario: ${error.message}`);   
        }
    }

    async deleteUserByEmail (email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return await User.findOneAndDelete({ email });
        } catch (error) {
            throw new Error(`Error eliminando usuario por email: ${error.message}`);   
        }
    }

}

export default new SessionsDAO();