import { Product } from "./product";
import { Store } from "./store";

export interface Purchase{
    total?: number;
    id?:number;
    updatedBy?: string;
    updatedAt?: string;
    createdAt: string;
    createdBy?: string;
    product:Product;
    store:Store;
    quantity:number;
    amount:number;
}