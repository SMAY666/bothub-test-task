import Fastify from 'fastify';
import {ENV} from './constants/env';
import {usersRoutes} from './routes/usersRoutes';


export const server = Fastify({
    logger: true
});

void server.register(usersRoutes, {prefix: '/users'});

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


