export type LoginPayload = {
    email: string;
    password: string;
}

export type LoginResponse = {
    type: 'BEARER';
    expiracao: string;
    token: string;
}

export type RegisterPayload = {
    name: string;
    cpf: string;
    email: string;
    phone: string;
    password: string;
}

export type RegisterResponse = {
    message: string;
    description: string;
}

