import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { DeliveryRequest } from '../model/request/delivery-request';
import { UpdateDeliveryPositionRequest } from '../model/request/UpdateDeliveryPositionRequest';
import { CustomPageResponse } from '../model/custom-response-page';
import { Page } from '../model/page';
import { Product } from '../model/product';
import { Delivery } from '../model/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {



  private readonly URL = environment.URL + `/delivery`;


  constructor(private http: HttpClient) { }



  findDeliveryByUser$ = (userId: number) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/users/${userId}`)
      .pipe();

  isAdelivery$ = (httpContent?: HttpContext) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/isDelivery`);

  deliveryForStore$ = (deliveryId: number, storeId: number) => <Observable<CustomResponse>>this.http
    .get<any>(`${this.URL}?storeId=${deliveryId}&storeId=${storeId}`)
    .pipe();


  delivery$ = (deliveryId: number) => <Observable<CustomResponse>>this.http
    .get<any>(`${this.URL}/${deliveryId}`)
    .pipe();


  deliveryList$ = (storeId: any) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/list?storeId=${storeId}`)
      .pipe(catchError(this.handlerError));


  deliveryListAll$ = () => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/list/all`)
      .pipe(catchError(this.handlerError));

  becommeDelivery$ = (request: DeliveryRequest) => <Observable<CustomResponse>>
    this.http
      .post<any>(`${this.URL}/add`, request);

  updateDeliveryPosition$ = (request: UpdateDeliveryPositionRequest, httpContent?: HttpContext) => <Observable<CustomResponse>>
    this.http
      .post<any>(`${this.URL}/update-delivery-position`, request);


  noActivedeliveryList$ = (storeId: number) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/inactive?storeId=${storeId}`)
      .pipe(tap(console.log));


  /**
      * It will be used when we want to make sur that product exists in the provided store.
      * @param page 
      * @param size 
      * @param storeId 
      * @returns 
      */
  getDeliveryByStore$ = (page: number = 0, size: number = 10, storeId: number) => <Observable<CustomPageResponse<Page<Delivery>>>>
    this.http
      .get<any>(`${this.URL}/store/list?storeId=${storeId}&page=${page}&size=${size}`).pipe(
        tap(console.log));

  // delivery profile
  deliveryProfile$ = (httpContent?: HttpContext) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/delivery-profile`);

  handlerError(error: HttpErrorResponse): Observable<never> {
    throw new Error(`An error occured - Error code :${error.message}`);
  }
}
