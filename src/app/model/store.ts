export interface Store {
    uuiId?: string;
    updatedBy?: string;
    updatedAt?: string;
    createdAt?: string;
    createdBy?: string;
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    email: string;
    address: string;
    active: boolean;
    image?: string;  
    approaveOrder?:boolean;
    certified?:boolean;
}