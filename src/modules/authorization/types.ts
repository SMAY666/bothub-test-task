export type SuccessAuthorized = {
    accessToken: string
}

export type TokenData = {
    userId: number
}

export type Token = {
    iss: string
    iat: number
    exp: number
}

export type AccessToken = TokenData & Token;
