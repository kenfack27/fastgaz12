import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { Observable, tap } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommissionService {


  private readonly URL = environment.URL + `/commission`;

  constructor(private http: HttpClient) { }


  getCommissionByUserAndcreatedAt$(createdDate: any): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(`${this.URL}/system/${createdDate}`).pipe(tap(console.log))
  }
  getCommission$ = (storeId: number, customerOrderId: number) => <Observable<CustomResponse>>
    this.http.get<any>(`${this.URL}/commission?storeId=${storeId}&customerOrderId=${customerOrderId}`);

  getCommissionSummary$ = (storeId: number) => <Observable<CustomResponse>>
    this.http.get<any>(`${this.URL}/commission-summary?storeId=${storeId}`);

  getCommissionByUser$ = (): Observable<CustomResponse> => <Observable<CustomResponse>>
    this.http.get<any>(`${this.URL}/system`);

  getCommisionByStore$ = (storeId: number) => <Observable<CustomResponse>>
    this.http.get<any>(`${this.URL}/store?storeId=${storeId}`);

  getCommissionByDelivery$ = (context?: HttpContext) => <Observable<CustomResponse>>
    this.http.get<any>(`${this.URL}/delivery`);
}
