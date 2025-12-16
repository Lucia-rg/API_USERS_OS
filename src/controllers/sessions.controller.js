import sessionsService from '../services/sessions.service.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.utils.js';

class SessionsController {

    async register(req, res) {
        try {
            const userData = req.body;
            const newUser = await sessionsService.registerUser(userData);

            res.redirect('/login');
            
        } catch (error) {
            console.error('Error en controlador de registro:', error);
            res.status(400).render('register', { 
                error: error.message,
                oldData: req.body
            });  
        }
    }

    async login(req, res) {
        try {
            const user = req.user;
            if(!user) {
                throw new Error('Error en la autenticación');
            }
            const token = generateToken(user);
            setTokenCookie(res, token);
            res.redirect('/products');
            
        } catch (error) {
             console.error('Error en controlador de login:', error);
            res.status(400).render('login', { 
                error: error.message,
                email: req.body.email
            }); 
        }
    }

    async logout(req, res) {
        try {
            clearTokenCookie(res);
            res.redirect('/login');  
        } catch (error) {
            console.error('Error en logout:', error);
            res.redirect('/products');   
        }
    }

    async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                success: false,
                error: 'No autenticado'
                });
            }
            res.json({
                success: true,
                user: req.user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            }); 
        }
    }

    // Users

    async getAllUsers(req, res) {
        try {
            const users = await sessionsService.getAllUsers();
            res.json({ 
                success: true, 
                data: users
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await sessionsService.getUserByEmail(email);
            res.json({ 
                success: true, 
                data: user 
            });
        } catch (error) {
            res.status(404).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await sessionsService.getUserById(id);
            res.json({ 
                success: true, 
                data: user 
            });
        } catch (error) {
            res.status(404).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const updatedUser = await sessionsService.updateUser(id, userData);
            res.json({ 
                success: true, 
                message: 'Usuario actualizado correctamente',
                data: updatedUser
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const resultDelete = await sessionsService.deleteUser(id);
            res.json({ 
                success: true, 
                message: resultDelete.message 
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async deleteUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const resultDelete = await sessionsService.deleteUserByEmail(email);
            res.json({ 
                success: true, 
                message: resultDelete.message
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Reestablecer contraseña
    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            await sessionsService.requestPasswordReset(email);
            res.status(200).json({ status: 'success', message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
        } catch (error) {
            console.error('ERROR CRÍTICO EN forgotPassword:', error);
            res.status(500).json({ status: 'error', message: error.message, debug: 'Revisar consola del servidor'});
        }
    }

    async resetPassword(req, res) {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        try {
            await sessionsService.resetPassword(token, newPassword);
            res.status(200).json({ status: 'success', message: 'Contraseña restablecida. Puedes iniciar sesión.' });
        } catch (error) {
            const statusCode = error.message.includes('misma que la anterior') ? 400 : 401;
            res.status(statusCode).json({ status: 'error', message: error.message });
        }
    }

    // async getResetPasswordView(req, res) {
    //     const { token } = req.params;
    //     try {
    //         await sessionsService.validateResetToken(token); 
    //         res.render('resetPassword', { token, status: 'valid' }); 
    //     } catch (error) {
    //         res.render('resetPassword', { status: 'invalid', message: error.message });
    //     }
    // }

}

export default new SessionsController();