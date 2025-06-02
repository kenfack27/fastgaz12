import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { Observable } from 'rxjs/internal/Observable';
import { TransactionHistoryRequest } from '../model/request/transaction-history-request';
import { TransactionHistory } from '../model/transaction-history';
import { Page } from '../model/page';
import { CustomPageResponse } from '../model/custom-response-page';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  private readonly URL = environment.URL + `/transaction-history`;
  constructor(private http: HttpClient) { }

  
  saveTransaction(request: TransactionHistoryRequest): Observable<CustomResponse> {
    return this.http.post<any>(`${this.URL}/add`, request);
  }

  transactionHistory$ = () => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/all`)
      .pipe(
        tap(console.log),
      );

  transactionHistories$ = (page: number = 0, size: number = 10, httpContext?: HttpContext) => <Observable<CustomPageResponse<Page<TransactionHistory>>>>
    this.http
      .get<any>(`${this.URL}/transaction-user?page=${page}&size=${size}`)
      .pipe(
        tap(console.log),
      );
  filterByDateRange$ = (page: number = 0, size: number = 10, httpContext?: HttpContext) => <Observable<CustomPageResponse<Page<TransactionHistory>>>>
    this.http
      .get<any>(`${this.URL}/transaction-user?page=${page}&size=${size}`)
      .pipe(
        tap(console.log),
      );
}
