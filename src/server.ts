import Fastify from 'fastify';
import {ENV} from './constants/env';


export const server = Fastify({
    logger: true
});

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


