import {ModelInstance} from '../../../interfaces/database/model/types';


export type UserAttributes = {
    id: number
    username: string
    passwordHash: string
    email: string
    role: number
}

export type UserCreationAttributes = Omit<UserAttributes, 'id' | 'passwordHash'>;

export type UserInstance = ModelInstance<{creationAttributes: UserCreationAttributes, attributes: UserAttributes}>
