import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthenticationRequest } from '../model/request/authentication-request';
import { CustomResponse } from '../model/custom-response';
import { Observable, tap, catchError } from 'rxjs';
import { CustomPageResponse } from '../model/custom-response-page';
import { Users } from '../model/users';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly URL: string = environment.URL + `/auth`;
  isLoggedIn = false;
  isValidToken = false;
  private readonly tokenKey: string = 'FAST__GAZ_API_TOKEN';

  constructor(private http: HttpClient) { }



  user$ = (userId: number) => <Observable<CustomResponse>>
    this.http
      .get<CustomResponse>(`${this.URL}/user?userId=${userId}}`)
      .pipe(tap(console.log));

  // List ofUsers
  users$ = (page: number = 0, size: number = 10) => <Observable<CustomPageResponse<Page<Users>>>>
    this.http
      .get<any>(`${this.URL}/users?page=${page}&size=${size}`)
      .pipe(

    );

  /** @param token Set Token to global app.*/
  addAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * @returns Fetch token globaly using a specifiv KEY.
   */
  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey) as string;
  }

  register$ = (authRquest: AuthenticationRequest) => <Observable<CustomResponse>>
    this.http
      .post<CustomResponse>(`${this.URL}/register`, authRquest)
      .pipe(
        tap(console.log)
      );

  login$ = (authRquest: AuthenticationRequest) => <Observable<CustomResponse>>
    this
      .http
      .post<CustomResponse>(`${this.URL}/authentication`, authRquest);


  confirm$ = (token: string) => <Observable<CustomResponse>>
    this.
      http.get<any>(`${this.URL}/activate-account?token=${token}`)
      .pipe(
        tap(console.log)
      );

  isLogged$ = (httpContext?: HttpContext) => <Observable<CustomResponse>>
    this.http.post<any>(`${this.URL}/is-logged`, httpContext)
      .pipe(
        tap(console.log)
      )

  isAuthenticated() {

  }

  registerBasicUser$ = (authRquest: AuthenticationRequest) => <Observable<CustomResponse>>
    this.http
      .post<CustomResponse>(`${this.URL}/register-basic`, authRquest);


  usersUUID$ = (uuid: string) => <Observable<CustomResponse>>this.http
    .get<any>(`${this.URL}/fake/${uuid}`);




  handlerError(error: HttpErrorResponse): Observable<HttpErrorResponse> {
    throw new Error(`An error occured - Error code :${error.message}`);
  }

}
