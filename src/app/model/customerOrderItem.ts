import { CustomerOrder } from "./customerOrder";
import { Product } from "./product";
import { Store } from "./store";

export interface CustomerOrderItem{
    uuiId?: string;
    id?: number;
    updatedBy?: string;
    updatedAt?: string;
    createdAt?: string;
    createdBy?: string;
    quantity:number;
    price:number;
    createdDate?:any;
    withPackaging:boolean;
    customerOrder:CustomerOrder;
    product:Product;
    store:Store;
}