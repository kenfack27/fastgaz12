import { CustomerOrder } from "./customerOrder";
import { Delivery } from "./delivery";
import { Users } from "./users";

export interface CommissionDelivery{
    id?:number;
    amount:number;
    createdAt:any;
    delivery?:Delivery;
    customerOrder?:CustomerOrder;
}