import {UserAttributes, UserCreationAttributes} from '../../modules/users/model/types';
import {SuccessAuthorized} from '../../modules/authorization/types';


export type GetRequest = {
    Params: {
        id: number
    }
    Reply: UserAttributes
}

export type RegisterRequest = {
    Body: {
        data: UserCreationAttributes,
        password: string
        confirmPassword: string
    }
    Reply: UserAttributes
}

export type LoginRequest = {
    Body: {
        username: string
        password: string
    }
    Reply: SuccessAuthorized
}
