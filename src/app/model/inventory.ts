import { MovementType } from "./enum/movmentType";
import { Product } from "./product";
import { Store } from "./store";

export interface Inventory {
    uuiId?: string;
    id?: number;
    updatedBy?: string;
    updatedAt?: string;
    createdAt: string;
    createdBy?: string;
    transactionId: string;
    movementType: MovementType;
    price: number;
    quantity: number;
    stockQuantity: number;
    amount: number;
    alertStock: number;
    product: Product;
    store: Store;
}