import { Delivery } from "../delivery";

export interface deliveryFound{
    distance:number;
    delivery:Delivery;
    deliveryId?:number;
}