import {FastifyPluginCallback} from 'fastify';
import {CreateRequest, GetAllRequest, GetByIdRequest} from './types';
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
    done();
}
