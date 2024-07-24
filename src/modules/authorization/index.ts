import {createHash} from './password';
import {SuccessAuthorized, TokenData} from './types';
import {usersRepository} from '../users/repository';
import {server} from '../../server';


class AuthorizationService {
    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private signAccessToken(userId: number): Promise<string> {
        const tokenData: TokenData = {userId};
        // @ts-ignore
        return server.jwt.sign(tokenData, {expires: '10d'});
    }


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public async login(username: string, password: string): Promise<SuccessAuthorized> {
        const user = await usersRepository.get({username});

        if (createHash(password) !== user._dataValues.passwordHash) {
            throw new Error('Password is incorrect');
        }

        const accessToken = await this.signAccessToken(user._dataValues.id);
        return {accessToken};
    }
}

export const authorizationRepository = new AuthorizationService();
