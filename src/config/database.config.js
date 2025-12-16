import dotenv from 'dotenv';
dotenv.config();

const databaseConfig = {
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME || 'users_onda_sonar',

    mongooseOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

if (!databaseConfig.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI no está definida en .env');
    process.exit(1);
}

export default databaseConfig;
export const EMAIL_SERVICE_USER = process.env.EMAIL_SERVICE_USER;
export const EMAIL_SERVICE_PASS = process.env.EMAIL_SERVICE_PASS;
export const BASE_URL = process.env.BASE_URL;
export const PASSWORD_RESET_EXPIRY_MS = process.env.PASSWORD_RESET_EXPIRY_MS;