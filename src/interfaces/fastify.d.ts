import {UserInstance} from '../modules/users/model/types';
import {UserRoles} from '../modules/users/constants';


declare module 'fastify' {
    export interface FastifyRequest {
        isAuth: boolean
        userId: number
        user: UserInstance
        role: UserRoles
    }
}
