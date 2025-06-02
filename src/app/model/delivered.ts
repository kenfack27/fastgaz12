import { Customer } from "./customer";
import { CustomerOrder } from "./customerOrder";
import { Delivery } from "./delivery";
import { Store } from "./store";

export interface Delivered {
    uuiId?: string;
    id?: number;
    updatedBy?: string;
    updatedAt?: string;
    createdAt: string;
    createdBy?: string;
    store:Store;
    customerOrder:CustomerOrder;
    delivery:Delivery;
    customer:Customer;

}
