import Fastify from 'fastify';
import {ENV} from './constants/env';
import {usersRoutes} from './routes/usersRoutes';
import {bookRoutes} from './routes/bookRoutes';
import {createHash} from './modules/authorization/password';
import {UserModel} from './modules/users/model';


export const server = Fastify({
    logger: true
});

void server.register(usersRoutes, {prefix: '/users'});
void server.register(bookRoutes, {prefix: '/books'});

export async function checkMainAdmin() {
    try {
        const mainAdminExist = await UserModel.findOne({
            where: {
                email: ENV.MAIN_ADMIN_EMAIL,
            }
        });

        if (!mainAdminExist) {
            await UserModel.create({
                username: 'main_admin',
                email: ENV.MAIN_ADMIN_EMAIL,
                passwordHash: createHash(ENV.MAIN_ADMIN_PASSWORD),
                role: 1
            });
        }
    } catch (err) {
        throw new Error(JSON.stringify(err));
    }
}

export async function startServer() {
    return new Promise((resolve, reject) => {
        server.listen({
            host: ENV.HOST,
            port: ENV.PORT
        }, (err, address) => {
            if (err) {
               reject(err);
            } else {
                resolve(address);
            }
        })
    })
}


