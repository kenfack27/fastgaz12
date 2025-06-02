import { CustomerOrderItem } from "../customerOrderItem";
import { Delivery } from "../delivery";

export interface CustomerOderConfirmationRequest {
    storeId: number;
    deliveryFee: number;
    packageFee: number;
    withPackaging: boolean;
    isFeeDelivered: boolean;
    userEmail: string;
    delivery?: Delivery;
    customerLatitude:number;
    customerLongitude:number;
    items?:CustomerOrderItem[];
}