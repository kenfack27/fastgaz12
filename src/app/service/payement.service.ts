import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.development';
import { PaymentData } from '../model/request/payment-data';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { CustomResponse } from '../model/custom-response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayementService {
  private baseUrl = environment.URL + '/payments';
  private URL = environment.URL + '/store-payments';
  constructor(private http: HttpClient) { }

  async makePayment(paymentData: any) {
    try {
      const response = await axios.post(`${this.baseUrl}/pay`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Payment error', error);
      throw error;
    }
  }

  paymentMTN(paymentData: PaymentData): Observable<any> {
    return this.http.post(`${this.baseUrl}/pay`, paymentData);

  }

  public paymentByStore$(storeId: number): Observable<CustomResponse> {
    return this.http.get<any>(`${this.URL}/payment-list?storeId=${storeId}`)
      .pipe(
        tap(console.log)
      )
  }
  // getNumberPurchase(storeId: number): Observable<CustomResponse> {
  //   return this.http.get<any>(`${this.URL}/total?storeId=${storeId}`)
  // }
}

