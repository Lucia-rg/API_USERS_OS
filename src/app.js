const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, '../public')));

// Configuración Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Conexión MongoDB
const databaseConfig = require("./config/database.config");
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

// Configuración de sesiones
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: databaseConfig.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000
  }
}));

// Routers
const viewsRouter = require('./routes/views.router');
const sessionsRouter = require('./routes/sessions.router');

app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

app.get('/', (req, res) => {
    res.redirect('/login');
});

// Servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en: http://localhost:${PORT}`);
});
