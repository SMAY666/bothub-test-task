import {RouteHandler} from 'fastify';
import {GetRequest, RegisterRequest} from './types';
import {usersRepository} from '../../modules/users/repository';


class Controller {
    public get: RouteHandler<GetRequest> = async (req, reply) => {
        const user = await usersRepository.getById(req.params.id);

        reply
            .status(200)
            .send(user._dataValues);
    }

    public register: RouteHandler<RegisterRequest> = async (req, reply) => {
        const newUser = await usersRepository.register(req.body.data, req.body.password, req.body.confirmPassword);

        reply
            .status(201)
            .send(newUser._dataValues);
    }
}

export const controller = new Controller();
