import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = ({password, hashedPassword}) => {
    return bcrypt.compareSync(password, hashedPassword);
}

export const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
}

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}