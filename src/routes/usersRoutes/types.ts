import {UserAttributes, UserCreationAttributes} from '../../modules/users/model/types';


export type GetRequest = {
    Params: {
        id: number,
    }
    Reply: UserAttributes
}

export type RegisterRequest = {
    Body: {
        data: UserCreationAttributes,
        password: string,
        confirmPassword: string
    }
    Reply: UserAttributes
}
