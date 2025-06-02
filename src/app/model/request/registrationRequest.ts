export interface RegistrationRequest {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    latitude: number;
    longitude: number;
    phone: string;
    address?: string;
}