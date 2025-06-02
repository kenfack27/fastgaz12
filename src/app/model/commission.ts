import { Users } from "./users";
import { CustomerOrder } from './customerOrder';

export interface Commission{
    id?:number;
    amount:number;
    createdAt:any;
    users?:Users;
    customerOrder:CustomerOrder;
}