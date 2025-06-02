import { SaleStatus } from "./sale-status";
import { Store } from "./store";

export interface Sale{
    id?:number;
    updatedBy?: string;
    updatedAt?: string;
    createdAt: string;
    createdBy?: string;
    saleStatus:SaleStatus;
    qrCode:string;
    transactionId:string;
    store:Store;
    amount:number;
    invoiceNumber?:string;
    
}