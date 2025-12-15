import passport from 'passport';

export const authorize = (allowedRoles = []) => {

    if (allowedRoles.length === 0) {
        return (req, res, next) => next();
    }

    return (req, res, next) => {
        passport.authenticate('current', { session: false }, (err, user, info) => {
            
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Error de autenticación' });
            }
            if (!user) {
                const authMessage = info?.message || 'Token requerido o inválido';
                return res.status(401).json({ status: 'error', message: authMessage });
            }
            req.user = user; 

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ 
                    status: 'error', 
                    message: `Acceso denegado. Rol '${user.role}' no autorizado.`});
            }
            next();

        })(req, res, next);
    };
};

export const isOwnerOrAdmin = (idParamName = 'id') => {
    return (req, res, next) => {

        passport.authenticate('current', { session: false }, (err, user, info) => {

            if (err) return res.status(500).json({ status: 'error', message: 'Error de autenticación' });
            if (!user) {
                const authMessage = info?.message || 'Token requerido o inválido';
                return res.status(401).json({ status: 'error', message: authMessage });
            }

            req.user = user;
            const resourceId = req.params[idParamName];
            const userId = user._id.toString(); 
            
            if (user.role === 'admin' || userId === resourceId) {
                next();
            } else {
                res.status(403).json({ 
                    status: 'error', 
                    message: 'Acceso denegado. Se requiere ser Administrador o Propietario del recurso.' 
                });
            }
        })(req, res, next);
    };
};

export const isAdmin = authorize(['admin']);
export const isUser = authorize(['user']);
export const isAdminOrUser = authorize(['admin', 'user']);