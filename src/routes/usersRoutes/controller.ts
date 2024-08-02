import {RouteHandler} from 'fastify';
import {
    GetMeRequest,
    GetRequest,
    LoginRequest,
    RegisterRequest,
    SendRegisterCodeRequest,
    UpdateRoleRequest
} from './types';
import {usersRepository} from '../../modules/users/repository';
import {authorizationRepository} from '../../modules/authorization';
import {emailService} from '../../services/emailService';


class Controller {
    public sendRegisterCode: RouteHandler<SendRegisterCodeRequest> = async (req, reply) => {
        await emailService.sendRegisterCode(req.body.email);
        reply
            .status(200)
            .send()
    }
    public register: RouteHandler<RegisterRequest> = async (req, reply) => {
        const newUser = await usersRepository.register(req.body.data, req.body.password, req.body.confirmPassword, req.body.code);

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
