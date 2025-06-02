export interface SaleSumary {
    productName: string;
    productQuantity: number;
    totalQuantity: number; // Assuming Long is represented as number in TypeScript
    totalAmount: number;   // Assuming Double is represented as number in TypeScript
    price:number;
}
