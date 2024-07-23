import {FastifyPluginCallback} from 'fastify';
import {CreateRequest, GetAllRequest, GetByIdRequest, UpdateRequest} from './types';
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
        {},
        controller.create,
    )
    instance.put<UpdateRequest>(
        '/:id',
        {},
        controller.update,
    )
    done();
}
