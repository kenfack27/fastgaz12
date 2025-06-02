import { Injectable } from '@angular/core';
import { DeliveredRequest } from '../model/request/delivered-request';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { CustomPageResponse } from '../model/custom-response-page';
import { Delivered } from '../model/delivered';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class DeliveredService {



  private readonly URL = environment.URL + `/delivered`;


  constructor(private http: HttpClient) { }


  delivered$ = (deliveryId: number) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}?deliveredId=${deliveryId}`)
      .pipe(catchError(this.handlerError));


  deliveredListForDelvery$ = (page: number = 0, size: number = 10, storeId: any, deliveryId: any) => <Observable<CustomPageResponse<Page<Delivered>>>>
    this.http
      .get<any>(`${this.URL}/delivery/delivered?page${page}&size=${size}&storeId=${storeId}&deliveryId=${deliveryId}`)
      .pipe(
        catchError(this.handlerError)
      );


  deliveredListForStore$ = (page: number = 0, size: number = 10, storeId: any) => <Observable<CustomPageResponse<Page<Delivered>>>>
    this.http
      .get<any>(`${this.URL}/store/delivered?page${page}&size=${size}&storeId=${storeId}`)
      .pipe(catchError(this.handlerError));


  AssignCustomerOrderToDelivery$ = (request: DeliveredRequest) => <Observable<CustomResponse>>
    this.http
      .post<any>(`${this.URL}/add`, request)
      .pipe(tap(console.log));

  handlerError(error: HttpErrorResponse): Observable<never> {
    throw new Error(`An error occured - Error code :${error.message}`);
  }
}
