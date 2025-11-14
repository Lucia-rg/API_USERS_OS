# 🎵 API Users - Onda Sonar

## 📋 Descripción del Proyecto

Sistema de autenticación y gestión de usuarios desarrollado con Node.js, Express y MongoDB. Implementa un sistema completo de registro, login y gestión de usuarios con autenticación JWT y roles de administrador.

## ⚙️ Configuración e Instalación

### Variables de Entorno (.env)

```env
MONGODB_URI=MONGODB_URI=mongodb+srv://<db_username>:<db_password>@clusteros.1uxee4j.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOS
DB_NAME=API_Users_Onda_Sonar
PORT=8080
NODE_ENV=development
JWT_SECRET=tu_clave_super_secreta_jwt
JWT_EXPIRES_IN=24h
```
### Instalación
**Instalar dependencias:** npm install

**Ejecutar en desarrollo:** npm run dev

**Ejecutar en producción:** npm start

## 🚀 Características

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación de datos
- **Login seguro** con Passport.js y JWT
- **Roles de usuario**: `user` y `admin`
- **Protección de rutas** con middleware JWT
- **Logout** con eliminación de tokens

### 👥 Gestión de Usuarios
- **CRUD completo** de usuarios
- **Sistema de permisos** (admin vs usuario regular)
- **Encriptación de contraseñas** con bcrypt
- **Tracking de conexiones** (last_connection)

### 🛡️ Seguridad
- **Autenticación JWT** almacenado en cookies HTTP-only
- **Validación de contraseñas** seguras
- **Protección contra duplicados** de email
- **Middleware de autorización** por roles

## 📊 Endpoints de la API

### 🔓 Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/sessions/register` | Registro de nuevo usuario |
| `POST` | `/api/sessions/login` | Login de usuario |
| `GET` | `/api/sessions/logout` | Cerrar sesión |

### 🔐 Endpoints Protegidos (Requieren JWT)

#### 👤 Usuario Actual
| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/api/sessions/current` | Obtener usuario actual | Cualquier usuario autenticado |

#### 👥 Gestión de Usuarios
| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/api/sessions/users` | Obtener todos los usuarios | Solo admin |
| `GET` | `/api/sessions/users/id/:id` | Obtener usuario por ID | Propio usuario o admin |
| `GET` | `/api/sessions/users/email/:email` | Obtener usuario por email | Solo admin |
| `PUT` | `/api/sessions/users/:id` | Actualizar usuario | Propio usuario o admin |
| `DELETE` | `/api/sessions/users/:id` | Eliminar usuario | Propio usuario o admin |
| `DELETE` | `/api/sessions/users/email/:email` | Eliminar usuario por email | Solo    admin |

## 🖥️ Vistas y Funcionalidades

### 🔓 Vistas Públicas

#### `login.handlebars`
- **Formulario de login** con email y contraseña
- **Validación en tiempo real** de credenciales
- **Redirección automática** si ya está autenticado
- **Enlace a registro** para nuevos usuarios

#### `register.handlebars`
- **Formulario de registro** con todos los campos requeridos
- **Validación de datos** del lado del servidor
- **Manejo de errores** con mensajes descriptivos
- **Detección automática** de rol admin (adminCoder@coder.com)

### 🔐 Vistas Protegidas

#### `products.handlebars`
- **Dashboard principal** después del login
- **Información del usuario** (nombre, email, rol)
- **Mensaje de bienvenida** personalizado
- **Botón de logout** funcional
- **Indicador visual** del rol (admin/user)

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport.js** - Middleware de autenticación
- **JWT** - Tokens de autenticación
- **bcrypt** - Encriptación de contraseñas

### Frontend
- **Handlebars** - Motor de plantillas
- **Bootstrap 5** - Framework CSS
- **JavaScript** - Interactividad del cliente

### Seguridad
- **JWT** - Autenticación stateless
- **HTTP-only Cookies** - Almacenamiento seguro de tokens
- **bcrypt** - Hash de contraseñas
- **Passport Strategies** - Múltiples métodos de autenticación

### Desarrollo
- **Nodemon** - Reinicio automático en desarrollo
- **dotenv** - Variables de entorno
- **ES Modules** - Sistema de módulos moderno

## 👨‍💼 Usuario de Prueba Admin

**Email:** `adminCoder@coder.com`  
**Contraseña:** admin123 
**Rol:** `admin` (asignado automáticamente)

## 🔄 Flujo de Autenticación

1. **Registro** → Crear cuenta → Redirige a login
2. **Login** → Verificar credenciales → Generar JWT → Redirigir a productos
3. **Acceso** → Validar JWT en cookies → Acceso a rutas protegidas
4. **Logout** → Eliminar cookie JWT → Redirigir a login

---

**Desarrollado por:** Lucía Rodríguez Giraldo  
**Tecnologías:** Node.js, Express, MongoDB, Passport.js, JWT, Handlebars

 
