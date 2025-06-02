import { AuthenticationResponse } from "./request/authentication-response";
import { CustomerOrder } from "./customerOrder";
import { CustomerOrderItem } from "./customerOrderItem";
import { Delivery } from "./delivery";
import { Inventory } from "./inventory";
import { Product } from "./product";
import { RegisterResponse } from "./request/register-response";
import { SaleItem } from "./sale-item";
import { Store } from "./store";
import { StoreProduct } from "./store-product";
import { StoreOwner } from "./storeOwner";
import { Users } from "./users";
import { CustomerOrderSumary } from "./utils/customer-order-sumary";
import { SaleSumary } from "./utils/sale-sumary";
import { Payment } from "./payment";
import { Commission } from "./commission";
import { CommissionDelivery } from "./commission-delivery";
import { CommissionStore } from "./commission-store";
import { Configuration } from "./configuration";
import { TransactionHistory } from './transaction-history';

export interface CustomResponse {
   
    timeStamp: string;
    statusCode: number;
    status: string;
    message: string;
    data: {
        deliveries?: Delivery[];
        message?: string;
        configuration?:Configuration;
        commissionStores?: CommissionStore[];
        commissionDeliveries?: CommissionDelivery[];
        commissions: Commission[];
        payments: Payment[];
        payment?: Payment;
        customerOrderSumary?:CustomerOrderSumary[];
        saleSumary?:SaleSumary[]
        deliverys: Delivery[];
        storeProducts?: StoreProduct[],
        delivery?: Delivery,
        customerOrderItems?: CustomerOrderItem[],
        customerOrderItem?: CustomerOrderItem,
        customerOrder?: CustomerOrder,
        customerOrders?: CustomerOrder[],
        saleItems?: SaleItem[],
        saleItem?: SaleItem,
        store?: Store,
        stores?: Store[],
        product?: Product;
        products?: Product[],
        user?: Users,
        register?: RegisterResponse,
        token?: AuthenticationResponse,
        storeOwner?: StoreOwner,
        storeOwners?: StoreOwner[],
        isStoreOwner?: boolean,
        totalSale?: number,
        amountSale?: number,
        amountCustomerOrder?: number,
        totalPurchase?: number,
        amountPurchase?: number,
        inventories?: Inventory[],
        inventory?: Inventory,
        isLogged?: boolean,
        isDelivery?: boolean,
        hasRoleSYSADMIN?: boolean,
        transactionHistory?:TransactionHistory,
        transactionHistories?:TransactionHistory[],
    };
}