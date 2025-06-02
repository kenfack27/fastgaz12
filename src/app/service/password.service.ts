import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {




  readonly URL: string = environment.URL + `/password`;

  constructor(private http: HttpClient) { }



  updatePassword$ = (passworsRequest: any) => <Observable<CustomResponse>>
    this.http
      .put<CustomResponse>(`${this.URL}/save-new-password`, passworsRequest)
      .pipe(tap());




  forgotPassword$ = (email: string) => <Observable<CustomResponse>>
    this.http
      .get<CustomResponse>(`${this.URL}/forgot-password?email=${email}`)
      .pipe(tap());
}
