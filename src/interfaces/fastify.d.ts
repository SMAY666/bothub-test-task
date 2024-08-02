import {UserInstance} from '../modules/users/model/types';
import {UserRoles} from '../modules/users/constants';
import {HookHandlerDoneFunction} from 'fastify';


declare module 'fastify' {
    export interface FastifyInstance {
        verifyJwt: (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => void
        verifyAdmin: (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => void
    }
    export interface FastifyRequest {
        isAuth: boolean
        userId: number
        user: UserInstance
        role: UserRoles
    }
}

export {};
