import {createHash} from './password';
import {AccessToken, SuccessAuthorized, TokenData} from './types';
import {usersRepository} from '../users/repository';
import server from '../../server';


class AuthorizationService {
    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private signAccessToken(userId: number): string {
        const tokenData: TokenData = {userId};
        return server.jwt.sign(tokenData, {expiresIn: '10d'});
    }


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public async login(username: string, password: string): Promise<SuccessAuthorized> {
        const user = await usersRepository.get({username});

        if (createHash(password) !== user._dataValues.passwordHash) {
            throw new Error('Password is incorrect');
        }

        const accessToken = this.signAccessToken(user._dataValues.id);
        return {accessToken};
    }

    public getAccessToken(authorizationHeader?: string) {
        if (!authorizationHeader) {
            throw new Error('Unauthorized');
        }

        const authHeaderParts = authorizationHeader.split(' ');
        if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
            throw new Error('Invalid authorization schema');
        }

        return authHeaderParts[1];
    }

    public verifyAccessToken(accessToken: string): AccessToken {
        return server.jwt.verify<AccessToken>(accessToken);
    }
}

export const authorizationRepository = new AuthorizationService();
