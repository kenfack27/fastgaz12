import { Product } from "./product";
import { Sale } from "./sale";
import { Store } from "./store";

export interface SaleItem{
    id?:number;
    product:Product;
    sale:Sale;
    store:Store;
    price:number;
    quantity:number;
    pdatedBy?: string
    updatedAt?: string
    createdAt: string
    createdBy?: string

}