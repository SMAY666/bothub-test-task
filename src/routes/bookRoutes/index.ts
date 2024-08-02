import {FastifyPluginCallback} from 'fastify';
import {
    CreateRequest,
    GetAllRequest,
    GetByIdRequest,
    UpdateRequest,
    DeleteRequest,
} from './types';
import {controller} from './controller';


export const bookRoutes: FastifyPluginCallback = (instance, opts, done) => {
    instance.get<GetAllRequest>(
        '/',
        {},
        controller.getAll,
    )
    instance.get<GetByIdRequest>(
        '/:id',
        {},
        controller.getById,
    )
    instance.post<CreateRequest>(
        '/',
        {
            onRequest: [instance.verifyJwt, instance.verifyAdmin]
        },
        controller.create,
    )
    instance.put<UpdateRequest>(
        '/:id',
        {},
        controller.update,
    )
    instance.delete<DeleteRequest>(
        '/:id',
        {},
        controller.delete,
    )
    done();
}
