import { Role } from "./enum/role"

export interface Users {
    phone?: any
    address?: any
    id: number
    lastName: string
    firstName: string
    email: string
    password: string
    imageUrl: string
    enable?: boolean
    fullName: string
    enabled?: boolean
    username: string
    authorities?: Authority[]
    updatedBy?: string
    updatedAt?: string
    createdAt?: string
    createdBy?: string
    uuiId?: string
    latitude?: number
    longitude?: number
    // role?:Role;
    role?:string;
}

export interface Authority {
    authority: string
}