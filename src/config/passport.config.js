const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');
const { isValidPassword } = require('../utils/auth.utils');
const { extractToken } = require('../utils/jwt.utils') ;

// Local

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({email});
        if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' }); 
        }

        if (!isValidPassword({password, hashedPassword: user.password})) {
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
    secretOrKey: process.env.JWT_SECRET,
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

module.exports = passport;