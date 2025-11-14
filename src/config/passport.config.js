import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import { isValidPassword } from '../utils/auth.utils.js';
import { extractToken } from '../utils/jwt.utils.js';
dotenv.config();

// Local

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({email});
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' }); 
        }

        const isPasswordValid = isValidPassword({ 
            password, 
            hashedPassword: user.password 
        });
      
        if (!isPasswordValid) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        user.last_connection = new Date();
        await user.save();

        return done(null, user);

    } catch (error) {
        return done(error, false);   
    }
}));

// JWT (autenticación de token)
const jwtOptions = {
    jwtFromRequest: extractToken,
    secretOrKey: process.env.JWT_SECRET || 'fallback-secret-key-for-development',
    passReqToCallback: true
};

passport.use('jwt', new JwtStrategy(jwtOptions, async (req, jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);

        if (user) {
            req.user = user;
            return done(null, user);
        } else {
            return done(null, false, {message: 'Usuario no encontrado'});
        }
        
    } catch (error) {
        return done(error, false);   
    }
}))

// Current 
passport.use('current', new JwtStrategy(jwtOptions, async (req, jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id).select('-password');

        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Token inválido o usuario no existe' });
        }
        
    } catch (error) {
        return done(error, false, { message: 'Error al validar token' });  
    }
}))

// Serialización y deserialización
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        return done(error, false);  
    }
});

export default passport;