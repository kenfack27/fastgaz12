import { Customer } from "./customer";
import { OrderStatus } from "./enum/order-status";
import { Store } from "./store";

export interface CustomerOrder {
    uuiId?: string;
    id?: number;
    updatedBy?: string;
    updatedAt?: string;
    createdAt: string;
    createdBy?: string;
    orderStatus:OrderStatus;
    qrcode:string;
    transactionId:string;
    deliveryFee:number;
    amount:number;
    total:number;
    customer:Customer;
    store:Store ;
    invoiceNumber?:string;
    wasAssignToDelivery:boolean;
    feeDelivered:boolean;
    latitude: number;
    longitude: number;


}