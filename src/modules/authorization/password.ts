import {hashSync} from 'bcrypt';
import {ENV} from '../../constants/env';

export function createHash(password: string) {
    return hashSync(password, ENV.SALT);
}
