export type ApiResponse = {
    message?: string;
    description?: string;
    [key: string]: string | undefined;
}

export type User = {
    name: string;
    email: string;
    avatar?: string;
}