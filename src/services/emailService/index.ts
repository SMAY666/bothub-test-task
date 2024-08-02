import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {ENV} from '../../constants/env';
import {redisConnection} from '../../connections/redisConnection';

class EmailService {
    constructor() {
        this.transport = nodemailer.createTransport({
            host: ENV.SMTP_HOST,
            port: ENV.SMTP_PORT,
            secure: true,
            auth: {
                user: ENV.EMAIL_TRANSPORT_ADDRESS,
                pass: ENV.EMAIL_TRANSPORT_PASSWORD,
            },
            from: 'bothub-test-task',
        });

        this.transport.verify((error: Error | null) => {
            if (error) {
                console.log(`emailTransport configuration validation failed: ${error.message}`);
            } else {
               console.log('emailTransport configuration passed validation successfully');
            }
        });
    }

    // ----- [ PRIVATE MEMBERS ] -----------------------------------------------------------------------------------------

    private readonly transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public async sendRegisterCode(email: string): Promise<boolean> {
        const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        return new Promise<boolean>((resolve, reject) => {
            this.transport.sendMail({
                to: email,
                subject: 'Код для регистрации bothub-test-task',
                html: `
                    <div>Ваш код для регистрации ${code}<div>
                `

            })
                .then(() => {
                    redisConnection.setEx(`register-code-${email}`, ENV.EMAIL_CODE_TIME, code.toString());
                    resolve(true);
                })
                .catch((err) => {
                    reject(Error(JSON.stringify(err)));
                });
        });
    }
}

export const emailService = new EmailService();
