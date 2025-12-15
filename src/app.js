import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

import databaseConfig from './config/database.config.js';
import './models/user.model.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import passport from './config/passport.config.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// Configuración Handlebars
app.engine("handlebars", handlebars.engine({
    helpers: {
        eq: function(a, b) {
            return a === b;
        }
    },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Conexión MongoDB
mongoose.connect(databaseConfig.MONGODB_URI, {
    ...databaseConfig.mongooseOptions,
    dbName: databaseConfig.DB_NAME
})
.then(() => {
    console.log('Conectado a MongoDB: ', databaseConfig.DB_NAME);
})
.catch((error) => {
    console.error('Error al conectarse a MongoDB: ', error.message);
    process.exit(1);
});

// Inicializar Passport
app.use(passport.initialize());

// Routers
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.redirect('/login');
});

// Servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
});
