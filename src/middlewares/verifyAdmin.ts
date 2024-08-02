import {FastifyReply, FastifyRequest, HookHandlerDoneFunction} from 'fastify';
import {UserRoles} from '../modules/users/constants';

const verifyAdmin = (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
        if (!((req.role & UserRoles.ADMIN) === UserRoles.ADMIN)) {
            throw new Error();
        }
        return done();
    } catch (err) {
        return reply
            .status(403)
            .send({message: 'Access denied'});
    }
};

export default verifyAdmin;
