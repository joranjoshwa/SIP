export type LoginPayload = {
    email: string;
    password: string;
}

export type LoginResponse = {
    type: 'BEARER';
    expiracao: string;
    token: string;
}