import {ModelInstance} from '../../../interfaces/database/model/types';


export type UserAttributes = {
    id: number
    username: string
    password: string
    email: string
    role: number
}

export type UserCreationAttributes = Omit<UserAttributes, 'id'>;

export type UserInstance = ModelInstance<{creationAttributes: UserCreationAttributes, attributes: UserAttributes}>
