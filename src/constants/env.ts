import "dotenv/config.js"
import {cleanEnv, num, str} from 'envalid';


export const ENV = cleanEnv(
    process.env,
    {
    HOST: str(),
    PORT: num(),
    DB_PORT: num(),
    DB_NAME: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    SALT: str(),
    MAIN_ADMIN_EMAIL: str(),
    MAIN_ADMIN_PASSWORD: str(),
    JWT_KEY: str(),
    SMTP_HOST: str(),
    SMTP_PORT: num(),

    EMAIL_TRANSPORT_ADDRESS: str(),
    EMAIL_TRANSPORT_PASSWORD: str(),

    REDIS_HOST: str(),
    REDIS_PORT: num(),

    /*REDIS_USER: str(),
    REDIS_PASS: str(),*/
    EMAIL_CODE_TIME: num(),
});
