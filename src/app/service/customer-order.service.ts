import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { catchError, tap } from 'rxjs/operators';
import { CustomerOderItemRequest } from '../model/request/customer-order-request';
import { CustomerOderConfirmationRequest } from '../model/request/customer-oder-confirmation-request';
import { CustomerOrder } from '../model/customerOrder';
import { CustomPageResponse } from '../model/custom-response-page';
import { Page } from '../model/page';
import { CustomerOrderItemRequestNoStore } from '../model/request/customer-order-item-request-no-store';
import { CustomerOrderItem } from '../model/customerOrderItem';
import { Store } from '../model/store';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {



  private readonly URL = environment.URL + `/customer/order`;

  constructor(private http: HttpClient) { }


  getProductByName$ = (productName: string, storeId: number) => <Observable<CustomResponse>>
    this
      .http
      .get<any>(`${this.URL}/product?productName=${productName}&storeId=${storeId}`).pipe(
      // tap(console.log)
    );

  getStoreById$ = (storeId: number) => <Observable<CustomResponse>>
    this
      .http
      .get<any>(`${this.URL}/store?storeId=${storeId}`).pipe(
      // tap(console.log)
    );




  addStoreProductToCart$ = (request: CustomerOrderItemRequestNoStore) => <Observable<CustomResponse>>this.http
    .post<any>(`${this.URL}/add-store-product`, request).pipe(
      tap(console.log),
      catchError(this.handlerError)
    );
  // clear Item to the cart
  clearToCart$ = () => <Observable<CustomResponse>>this.http
    .get<any>(`${this.URL}/clear`);

  // Add Item to the cart
  addToCart$ = (request: CustomerOderItemRequest) => <Observable<CustomResponse>>this.http
    .post<any>(`${this.URL}/add`, request).pipe(
      tap(console.log),
      catchError(this.handlerError)
    );

  // Not saved into databse
  customerOrderCarts$ = () => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/item`).pipe(
        tap(console.log)
      );

  // customer order list for store use case (OWNER)
  customerOrderListForStore$ = (page: number = 0, size: number = 10, storeId: number) => <Observable<CustomPageResponse<Page<CustomerOrder>>>>this.http
    .get<any>(`${this.URL}/store/list?storeId=${storeId}&page=${page}&size=${size}`).pipe(
      catchError(this.handlerError)
    );

  // customer order list for Customer use case (Customer)
  customerOrderListForCustomer$ = (customerOrderId: number, page: number = 0, size: number = 10) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/customer?customerOrderId=${customerOrderId}&page=${page}&size=${size}`).pipe(
        catchError(this.handlerError)
      );

  // Confirm the customer order (CUSTOMER).
  confirm$ = (request: CustomerOderConfirmationRequest) => <Observable<CustomResponse>>
    this.http
      .post<any>(`${this.URL}/confirm`, request);

  // Approce the customer order (STORE OWNER).
  approve$ = (request: CustomerOrder, httpContext?: HttpContext) => <Observable<CustomResponse>>this.http
    .post<any>(`${this.URL}/approved`, request).pipe(
      tap(console.log),
      catchError(this.handlerError)
    );

  getCustomerOrderItemByCustomerOrder$ = (customerOrderId: number) => <Observable<CustomResponse>>this.http
    .get<any>(`${this.URL}/customer?customerOrderId=${customerOrderId}`).pipe(
      // tap(console.log),
      catchError(this.handlerError)
    );

  getCustomerOrderItemByCustomerOrderInStore$ = (customerOrderId: any, storeId: number) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/customer-order-details?customerOrderId=${customerOrderId}&storeId=${storeId}`).pipe(
        tap(console.log),
        catchError(this.handlerError)
      );

  handlerError(error: HttpErrorResponse): Observable<never> {
    throw new Error(`An error occured - Error code :${error.message}`);
  }



  /// Correct way to store
  setItem(key: string, value: any): void {
    try {
      // Ensure you're storing a string representation
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  // Correct way to retrieve
  getItem(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  // Method to remove an item from localStorage
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  // Method to clear all items from localStorage
  clearItems(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  // Example method for customer order-specific operations
  saveCurrentOrder(order: CustomerOrderItem[]): void {
    // console.log(order);
    this.setItem('currentOrder', order);
  }

  getCurrentOrder(): CustomerOrderItem[] {
    const orders = this.getItem('currentOrder');
    return orders ? orders : [];
    // Or using nullish coalescing operator
    // return this.getItem('currentOrder') ?? [];
  }
}
