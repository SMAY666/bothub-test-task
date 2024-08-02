import {UserAttributes, UserCreationAttributes} from '../../modules/users/model/types';
import {SuccessAuthorized} from '../../modules/authorization/types';
import {UserRoles} from '../../modules/users/constants';


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

export type GetRequest = {
    Params: {
        id: number
    }
    Reply: UserAttributes
}

export type UpdateRoleRequest = {
    Params: {
        id: number
    }
    Body: {
        role: UserRoles
    }
    Reply: UserAttributes
}

export type GetMeRequest = {
    Reply: UserAttributes
}
