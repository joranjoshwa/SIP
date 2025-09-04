type JwtPayload = {
    sub: string;
    type?: "verify" | "reactivation";
    exp?: number;
    iat?: number;
    [key: string]: any;
};