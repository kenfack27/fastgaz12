import { Product } from "../product";
import { Store } from "../store";

export interface PurchaseRequest{
    amount: number;
    product:Product;
    quantity:number;
    store:Store;
}