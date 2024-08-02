import {FastifyPluginCallback} from 'fastify';
import {controller} from './controller';
import {GetMeRequest, GetRequest, LoginRequest, RegisterRequest, UpdateRoleRequest} from './types';


export const usersRoutes: FastifyPluginCallback = (instance, opts, done) => {
    instance.post<RegisterRequest>(
        '/register',
        {},
        controller.register,
    )

    instance.post<LoginRequest>(
        '/login',
        {},
        controller.login,
    )

    instance.get<GetMeRequest>(
        '/me',
        {onRequest: instance.verifyJwt},
        controller.getMe,
    )

    instance.put<UpdateRoleRequest>(
        '/:id/role',
        {onRequest: [instance.verifyJwt, instance.verifyAdmin]},
        controller.changeRole,
    )
    done();
};
