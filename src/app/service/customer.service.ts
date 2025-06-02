import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { CustomPageResponse } from '../model/custom-response-page';
import { CustomerOrder } from '../model/customerOrder';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly URL = environment.URL + `/customer`;

  constructor(private http: HttpClient) { }

  getMyOrder$ = (page: number = 0, size: number = 10) => <Observable<CustomPageResponse<Page<CustomerOrder>>>>
    this.http
      .get<any>(`${this.URL}/my-order?&page=${page}&size=${size}`).pipe()

}
