import { Store } from "../store";

export interface ProductRequest {
    id?: any;
    name: string;
    buyPrice: number;
    price: number;
    priceWithPackaging: number;
    quantity: number;
    image: string;
    alertThreshold: number;
    store: Store;
}