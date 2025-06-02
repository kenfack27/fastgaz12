import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';

@Injectable({
  providedIn: 'root'
})
export class StoreNotSecureService {

  private readonly URL = environment.URL + `/no-secure-store`;
  private readonly STORE_ID = "STORE_ID";
  customerOrderService: any;

  constructor(private http: HttpClient) { }
  

  getAllActiveStore$ = () => <Observable<CustomResponse>>this.http
    .get<any>(`${this.URL}/active-store`).pipe();
     
}
