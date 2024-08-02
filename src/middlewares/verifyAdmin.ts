import {FastifyReply, FastifyRequest, HookHandlerDoneFunction} from 'fastify';

const verifyAdmin = (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
        if (
            (req.role.priority !== RoleLevel.Owner) &&
            (req.role.priority !== RoleLevel.Admin) &&
            !req.isCompanyOwner
        ) {
            throw new Error();
        }
        return done();
    } catch (err) {
        return reply
            .status(403)
            .send({message: 'Access denied 1'});
    }
};

export default verifyAdmin;
