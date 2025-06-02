import { Store } from "./store";
import { Users } from "./users";
import { CustomerOrder } from './customerOrder';

export interface CommissionStore{
    id?:number;
    amount:number;
    createdAt:any;
    store?:Store;
    customerOrder?:CustomerOrder;
}