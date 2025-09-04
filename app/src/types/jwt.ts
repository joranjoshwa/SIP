import { TokenType } from "./token";

export type JwtPayload = {
    sub: string;
    type?: TokenType;
    exp?: number;
    iat?: number;
    [key: string]: any;
};