import { Store } from "./store";
import { Users } from "./users";

export interface Delivery{
    active?: boolean;
    uuiId?: string;
    id?: number;
    updatedBy?: string;
    updatedAt?: string;
    createdAt?: string;
    createdBy?: string;
    store:Store;
    users:Users;
    latitude?: number;
    longitude?: number;
    benefice:number;
    busy:boolean;
}