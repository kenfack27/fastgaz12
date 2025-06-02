import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { CountryInfo } from '../model/utils/country-info';
import { IpAdrress } from '../model/utils/ip-address';

@Injectable({
  providedIn: 'root'
})
export class ApiApiService {
  API_IP: any = 'https://apiip.net/api/check?ip=&accessKey=d88b317a-1115-4aef-bf1f-9b8d9253b734';
  readonly ipApiUrl = 'https://api.ipify.org?format=json';

  constructor(private http: HttpClient) { }

  userCurrentPositionInfo$ = (ip:string) =><Observable<CountryInfo>>this.http
    .get<CountryInfo>(`https://apiip.net/api/check?ip=${ip}&accessKey=d88b317a-1115-4aef-bf1f-9b8d9253b734`).pipe(
      tap(console.log),
      catchError(this.handlerError)
    );

  ipAddress$ = <Observable<IpAdrress>>this.http
    .get<IpAdrress>(`${this.ipApiUrl}`).pipe(
      tap(console.log),
      catchError(this.handlerError)
    )

  handlerError(error: HttpErrorResponse): Observable<never> {
    throw new Error('Error .' + error.message);
  }
}
