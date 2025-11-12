import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

export const generateToken = (user) => {
    const payload = {
        id: user._id || user.id,
        email: user.email,
        first_name: user.first_name,
        role: user.role
    };

    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };

    return jwt.sign(payload, jwt_secret, options);
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwt_secret);
    } catch (error) {
        throw new Error(`Token inválido: ${error.message}`);    
    }
}

export const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24*60*60*1000
    };

    res.cookie('authCookie', token, cookieOptions);
}

export const clearTokenCookie = (res) => {
    res.clearCookie('authCookie', {httpOnly: true, sameSite: 'strict'});
}

export const extractToken = (req) => {
    return req.cookies?.authCookie || null;
}

