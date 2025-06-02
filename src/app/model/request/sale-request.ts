import { Product } from "../product";
import { Store } from "../store";

export interface SaleRequest{
    product: Product,
    quantity: number,
    price: number,
    store: Store
}