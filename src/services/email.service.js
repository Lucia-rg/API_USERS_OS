import nodemailer from 'nodemailer';
import { EMAIL_SERVICE_USER, EMAIL_SERVICE_PASS, BASE_URL } from '../config/database.config.js';

class EmailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_SERVICE_USER,
                pass: EMAIL_SERVICE_PASS
            }
        });
    }

    async sendPasswordResetEmail(to, token) {
        const resetLink = `${BASE_URL}/api/sessions/reset-password/${token}`;
        
        const htmlContent = `
            <h1>Recuperación de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3a0a46ff; color: white; text-decoration: none; border-radius: 5px;">
                Restablecer Contraseña
            </a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `;

        const mailOptions = {
            from: EMAIL_SERVICE_USER,
            to: to,
            subject: 'Recuperación de Contraseña - Onda Sonar',
            html: htmlContent
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Correo de recuperación enviado a: ${to}`);
        } catch (error) {
            console.error('Error enviando correo de recuperación:', error);
            throw new Error('No se pudo enviar el correo de recuperación.');
        }
    }

}

export default new EmailService();
