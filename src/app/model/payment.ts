import { PaymentStatus } from "./enum/paymentStatus";

export interface Payment {
    id?: number;
    amount: number;
    currency: string;
    externalId: string;
    payerNumber: string;
    receiverNumber: string;
    customerOrderId: number;
    storeId: number;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    paymentStatus: PaymentStatus;
    transaction: string;

}