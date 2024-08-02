import {RouteHandler} from 'fastify';
import {GetMeRequest, GetRequest, LoginRequest, RegisterRequest, UpdateRoleRequest} from './types';
import {usersRepository} from '../../modules/users/repository';
import {authorizationRepository} from '../../modules/authorization';


class Controller {
    public register: RouteHandler<RegisterRequest> = async (req, reply) => {
        const newUser = await usersRepository.register(req.body.data, req.body.password, req.body.confirmPassword);

        reply
            .status(201)
            .send(newUser._dataValues);
    }

    public login: RouteHandler<LoginRequest> = async (req, reply) => {
        const result = await authorizationRepository.login(req.body.username, req.body.password);

        reply
            .status(200)
            .send(result);
    }

    public get: RouteHandler<GetRequest> = async (req, reply) => {
        const user = await usersRepository.getById(req.params.id);

        reply
            .status(200)
            .send(user._dataValues);
    }

    public getMe: RouteHandler<GetMeRequest> = async (req, reply) => {
        reply
            .status(200)
            // @ts-ignore
            .send(req.user._dataValues)
    }

    public changeRole: RouteHandler<UpdateRoleRequest> = async  (req, reply) => {
        const user = await usersRepository.changeRole(req.params.id, req.body.role);

        reply
            .status(200)
            .send(user._dataValues);
    }
}

export const controller = new Controller();
