export interface StoreOrderStats{
    storeId: number;
    storeName: string;
    pendingCount: number;
    approvedCount: number;
    paidCount: number;
    inDeliveryCount: number;
}