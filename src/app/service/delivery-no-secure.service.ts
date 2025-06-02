import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryNoSecureService {

  private readonly URL = environment.URL + `/no-secure-delivery`;


  constructor(private http: HttpClient) { }

  noActivedeliveryList$ = (storeId: number) => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}/inactive?storeId=${storeId}`)
      .pipe(tap(console.log));
}
