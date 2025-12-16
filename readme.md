# 🎵 API Users - Onda Sonar

## 📋 Descripción del Proyecto

Sistema integral de **E-commerce** y gestión de usuarios desarrollado con Node.js, Express y MongoDB. Implementa un sistema completo de registro, login y gestión de usuarios, así como un flujo comercial completo con gestión de productos, carritos, control de stock y formalización de compras mediante tickets, estructurado bajo una **Arquitectura de Capas (DAO, Repository, Service, Controller)** para una alta mantenibilidad.

## ⚙️ Configuración e Instalación

1. Copia `.env.example` a `.env`
2. Configura tus variables de entorno

### Variables de Entorno (.env)

```env
MONGODB_URI=MONGODB_URI=mongodb+srv://<db_username>:<db_password>@clusteros.1uxee4j.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOS
DB_NAME=API_Users_Onda_Sonar
PORT=8080
NODE_ENV=development
JWT_SECRET=tu_clave_super_secreta_jwt
JWT_EXPIRES_IN=24h
EMAIL_SERVICE_USER=tu_correo_de_envio@gmail.com
EMAIL_SERVICE_PASS=tu_contraseña_de_aplicacion_de_16_caracteres
BASE_URL=http://localhost:8080 # URL base para enlaces de correo
PASSWORD_RESET_EXPIRY_MS=3600000 # 1 hora (3600000 milisegundos)
```
### Instalación
**Instalar dependencias:** npm install

**Ejecutar en desarrollo:** npm run dev

**Ejecutar en producción:** npm start

## 🚀 Características

### 🔐 E-commerce
- **Arquitectura de Capas:** Uso de DAO, Repository, Service, y Controller para una clara separación de responsabilidades.
- **Gestión de Productos (CRUD):** Creación, lectura (sin paginación), actualización y eliminación.
- **Flujo de Compra Transaccional:**
  - **Validación de Stock:** Lógica estricta de "Todo o Nada" por cada ítem en el carrito.
  - **Generación de Tickets:** Creación de comprobantes inmutables (Ticket) con código único.
  - **Actualización de Stock:** Descuento de stock solo para productos comprados exitosamente.
  - **Manejo de Fallos:** Productos sin stock suficiente permanecen en el carrito.
- **Gestión de Carrito:**
  - Agregar/actualizar productos en el carrito.
  - Vaciar carrito completamente (`DELETE /api/carts/:cid`).

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación de datos y asignación de carrito por defecto
- **Login seguro** con Passport.js y JWT
- **Roles de usuario**: `user` y `admin`
- **Protección de rutas** con middleware JWT
- **Logout** con eliminación de tokens
- **Recuperación de Contraseña:** Generación de token seguro por email y endpoint para reestablecer la clave.

### 👥 Gestión de Usuarios
- **CRUD completo** de usuarios
- **Sistema de permisos** (admin vs usuario regular)
- **Encriptación de contraseñas** con bcrypt
- **Tracking de conexiones** (last_connection)

### 🛡️ Seguridad
- **Autenticación JWT** almacenado en cookies HTTP-only
- **Validación de contraseñas** seguras
- **Protección contra duplicados** de email
- **Middleware de autorización** por roles y por propiedad de recurso (`isOwnerOrAdmin`)

## 📊 Endpoints de la API

### 🔓 Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/sessions/register` | Registro de nuevo usuario (Crea carrito por defecto) |
| `POST` | `/api/sessions/login` | Login de usuario |
| `GET` | `/api/sessions/logout` | Cerrar sesión |
| `POST` | `/api/sessions/forgot-password` | **Solicita token** de recuperación por email (envía correo). |
| `POST` | `/api/sessions/reset-password/:token` | **Reestablece la contraseña** utilizando el token recibido. |

### 🔐 Endpoints Protegidos (Requieren JWT)

#### 🛍️ Gestión de Productos
| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/api/products` | Obtener listado de todos los productos| User o Admin |
| `POST` | `/api/products` | Crear nuevo producto | Solo Admin |
| `PUT` | `/api/products/:pid` | Actualizar producto por ID | Solo Admin |
| `DELETE` | `/api/products/:pid` | Eliminar producto por ID | Solo Admin |

#### 🛒 Gestión de Carrito y Compra
| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/api/carts/:cid` | Ver contenido del carrito | Dueño o Admin |
| `POST` | `/api/carts/:cid/product/:pid` | Agregar/actualizar producto en el carrito | Solo User |
| `POST` | `/api/carts/:cid/purchase` | Finalizar la compra (Genera Ticket, Stock y Actualización de Carrito) | Solo User |
| `DELETE` | `/api/carts/:cid` | Vaciar completamente el carrito | Dueño o Admin |

#### 👤 Usuario Actual
| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/api/sessions/current` | Obtener usuario actual | Cualquier usuario autenticado |

#### 👥 Gestión de Usuarios

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| `GET` | `/api/users` | Obtener todos los usuarios | Solo admin |
| `GET` | `/api/users/id/:id` | Obtener usuario por ID | Propio usuario o admin |
| `GET` | `/api/users/email/:email` | Obtener usuario por email | Solo admin |
| `PUT` | `/api/users/:id` | Actualizar usuario | Propio usuario o admin |
| `DELETE` | `/api/users/:id` | Eliminar usuario | Propio usuario o admin |
| `DELETE` | `/api/users/email/:email` | Eliminar usuario por email | Solo admin |

## 🖥️ Vistas y Funcionalidades

### 🔓 Vistas Públicas

#### `login.handlebars`
- **Formulario de login** con email y contraseña
- **Validación en tiempo real** de credenciales
- **Redirección automática** si ya está autenticado
- **Enlace a registro** para nuevos usuarios
- **Nota Importante:** La lógica de la API para el restablecimiento de contraseña está implementada y verificada mediante Postman, aunque las vistas front-end asociadas (resetPassword.handlebars) están actualmente comentadas en el router.

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
- **UUID** - Generación de códigos de ticket
- **Nodemailer** - Servicio para envío de correos electrónicos (para recuperación de contraseña)

### Frontend
- **Handlebars** - Motor de plantillas
- **Bootstrap 5** - Framework CSS
- **JavaScript** - Interactividad del cliente

### Seguridad
- **JWT** - Autenticación stateless
- **HTTP-only Cookies** - Almacenamiento seguro de tokens
- **bcrypt** - Hash de contraseñas
- **Passport Strategies** - Múltiples métodos de autenticación
- **isOwnerOrAdmin** - Autorización de recurso

### Desarrollo
- **Nodemon** - Reinicio automático en desarrollo
- **dotenv** - Variables de entorno
- **ES Modules** - Sistema de módulos moderno

## 👨‍💼 Usuario de Prueba Admin

**Email:** `adminCoder@coder.com`  
**Contraseña:** `admin123`  
**Rol:** `admin` (asignado automáticamente)

## 🔄 Flujo de Autenticación y compra

1. **Registro** → Crear cuenta (genera carrito) → Redirige a login
2. **Login** → Verificar credenciales → Generar JWT → Redirigir a productos
3. **Acceso** → Validar JWT en cookies → Acceso a rutas protegidas
4. **Compra** → Agregar a carrito → `/purchase` → Generar Ticket + Actualizar Stock
5. **Logout** → Eliminar cookie JWT → Redirigir a login

## 🔒 Flujo de Recuperación de Contraseña

1. Solicitud de Token

**Usuario** → `POST /api/sessions/forgot-password` (con email) → **Servidor** (Generar Token, Guardar en DB, Setear Expiración) → **Nodemailer** (Enviar email con enlace)

2. Restablecimiento de Contraseña

**Usuario** → `POST /api/sessions/reset-password/:token` (con `newPassword`) → **Servidor** (Validar Token, Comparar con Clave Antigua, Hashear Nueva Clave) → **Servidor** (Actualizar `password` en DB, Eliminar Token/Expiración de DB) → **API** (Mensaje de Éxito)

---

**Desarrollado por:** Lucía Rodríguez Giraldo  
**Tecnologías:** Node.js, Express, MongoDB, Passport.js, JWT, Handlebars

 
