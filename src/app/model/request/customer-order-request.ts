import { Product } from "../product";
import { Store } from "../store";

export interface CustomerOderItemRequest{
    product: Product;
    quantity: number;
    withPackaging:boolean;
    price: number;
    store: Store;
    userEmail?:string;
}