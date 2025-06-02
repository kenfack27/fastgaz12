export interface PaymentData{
    amount: number;
    currency: number;
    externalId: number;
    payerNumber: number;
    receiverNumber: number;
    customerOrderId:number;
    storeId?:number;
}