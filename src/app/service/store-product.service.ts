import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';

@Injectable({
  providedIn: 'root'
})
export class StoreProductService {

  private readonly URL = environment.URL + `/store-product`;


  constructor(private http: HttpClient) { }

  productList$ = () => <Observable<CustomResponse>>
    this.http
      .get<any>(`${this.URL}`)
      .pipe();


  handlerError(error: HttpErrorResponse): Observable<never> {
    throw new Error(`An error occured - Error code :${error.message}`);
  }
}
