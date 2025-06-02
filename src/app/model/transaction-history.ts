import { PaymentStatus } from "./enum/paymentStatus";
import { TransactionHistoryType } from "./enum/transaction-history-type";
import { Users } from "./users";

export interface TransactionHistory {
    id: number;
    amount: number;
    description: string;
    date: string; // will be converted to/from LocalDate in Java
    paymentStatus: PaymentStatus;
    transactionHistoryType: TransactionHistoryType;
    user: Users;
    updatedBy?: string;
    updatedAt?: string;
    createdAt?: string;
    createdBy?: string;
}
