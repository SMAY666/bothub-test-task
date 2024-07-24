import {FastifyJWTOptions} from '@fastify/jwt';
import {ENV} from './env';


export const jwtOptions: FastifyJWTOptions = {
    secret: ENV.JWT_KEY,
    sign: {
        algorithm: 'HS512',
    },
}
