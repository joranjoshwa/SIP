type JwtPayload = {
    sub: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
};