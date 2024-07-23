import {FastifyPluginCallback} from 'fastify';
import {controller} from './controller';
import {GetRequest, RegisterRequest} from './types';


export const usersRoutes: FastifyPluginCallback = (instance, opts, done) => {
    instance.get<GetRequest>(
        '/users/:id',
        {},
        controller.get,
    )

    instance.post<RegisterRequest>(
        '/register',
        {},
        controller.register,
    )
    done();
};
