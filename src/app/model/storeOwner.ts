import { Store } from "./store";
import { Users } from "./users";

export interface StoreOwner {
    uuiId?: string;
    updatedBy?: string
    updatedAt?: string
    createdAt: string
    createdBy: string
    users: Users;
    store: Store;
    guest: boolean;
    admin: boolean;
    accessRevoked: boolean;
}