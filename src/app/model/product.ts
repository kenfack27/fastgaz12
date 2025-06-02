import { Store } from "./store"

export interface Product {
    updatedBy?: string
    updatedAt?: string
    createdAt?: string
    createdBy?: string
    id?: number
    name: string
    buyPrice: number
    price: number
    priceWithPackaging: number
    alertThreshold: number
    store: Store;
    quantity:number;
    image?:string;
}