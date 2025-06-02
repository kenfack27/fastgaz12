import { Delivery } from "../delivery";
import { CustomerOrder } from '../customerOrder';

export interface ApproveCustomerOrder{
    delivery:Delivery;
    customerOrder:CustomerOrder;
}