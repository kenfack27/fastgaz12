import { Delivery } from "../delivery";
import { Store } from "../store";

export interface CustomerOrderItemRequestNoStore {
    image?: string;
    productName: string;  // Product name
    quantity: number;     // Quantity
    price: number;        // Price
    withPackaging: boolean; // Whether the item includes packaging
    latitude: number;     // Latitude (automatically fetched from JavaScript navigator)
    longitude: number;    // Longitude (automatically fetched from JavaScript navigator)
    delivery?: Delivery;
    store?:Store;
}
