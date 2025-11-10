export type ApiResponse = {
    message?: string;
    description?: string;
    [key: string]: string | undefined;
}

export type User = {
    name: string;
    email: string;
    avatar?: string;
    registrationDate: string;
}

export interface ChangePasswordRequest {
    password: string;
    newPassword: string; 
  }

export interface UserDTO {
    name: string;
    cpf: string;
    email: string;
    role: string;             
    statusMember: string;     
    phone: string;
    profileImageUrl: string;
    registrationDate: string; 
}