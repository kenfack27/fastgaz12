import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CustomResponse } from '../model/custom-response';
import { CustomPageResponse } from '../model/custom-response-page';
import { Page } from '../model/page';
import { Users } from '../model/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  readonly URL: string = environment.URL + `/users`;
  isLoggedIn = false;
  isValidToken = false;
  private readonly tokenKey: string = 'FAST__GAZ_API_TOKEN';

  constructor(private http: HttpClient) { }


  user$ = (userId: number) => <Observable<CustomResponse>>
    this.http
      .get<CustomResponse>(`${this.URL}/user?userId=${userId}`)
      .pipe(tap());

  // List ofUsers
  users$ = (page: number = 0, size: number = 10) => <Observable<CustomPageResponse<Page<Users>>>>
    this.http
      .get<any>(`${this.URL}/users?page=${page}&size=${size}`)
      .pipe();

  hasRoleSYADMIN$ = (httContext?: HttpContext) => <Observable<CustomResponse>>
    this.http
      .get<CustomResponse>(`${this.URL}/has-role-sysadmin`)
      .pipe(tap());

  hasRoleMANAGER$ = (httContext?: HttpContext) => <Observable<CustomResponse>>
    this.http
      .get<CustomResponse>(`${this.URL}/has-role-MANAGER`)
      .pipe(tap());

  me$ = (httContext?: HttpContext) => <Observable<CustomResponse>>
    this.http
      .get<CustomResponse>(`${this.URL}/me`)
      .pipe(tap(console.log));

}
