import {ModelInstance} from '../../../interfaces/database/model/types';
import {UserRoles} from '../constants';


export type UserAttributes = {
    id: number
    username: string
    passwordHash: string
    email: string
    role: UserRoles
}

export type UserCreationAttributes = Omit<UserAttributes, 'id' | 'passwordHash' | 'role'>;

export type UserInstance = ModelInstance<{creationAttributes: UserCreationAttributes, attributes: UserAttributes}>
