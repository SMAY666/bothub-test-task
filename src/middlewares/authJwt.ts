import {FastifyReply, FastifyRequest} from 'fastify';
import {authorizationRepository} from '../modules/authorization';
import {usersRepository} from '../modules/users/repository';

const verifyJwt = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const accessToken = authorizationRepository.getAccessToken(req.headers.authorization);
        const tokenData = authorizationRepository.verifyAccessToken(accessToken);

        req.isAuth = true;
        req.userId = tokenData.userId;
        // @ts-ignore
        req.user = await usersRepository.getById(tokenData.userId);
        // @ts-ignore
        req.role = req.user._dataValues.role

    } catch (err) {
        return reply
            .status(401)
            .send('Unauthorized');
    }
};

export default verifyJwt;
