import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  email: string;

  private readonly tokenKey: string = 'FAST__GAZ_API_TOKEN';
  private readonly USER_FAKE_ID: string = 'FAST_GAZ_API_USER_FAKE_ID';
  private readonly USER_NAME: string = 'USERNAME';


  public set token(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  get token() {
    return localStorage.getItem(this.tokenKey) as string;
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setUserFakeID(USER_FAKE_ID: string): void {
    localStorage.setItem(this.USER_FAKE_ID, USER_FAKE_ID);
  }

  public  gettUserFakeID() {
    return localStorage.getItem(this.USER_FAKE_ID) as string;
  }

  setUserName(USER_NAME: string): void {
    localStorage.setItem(this.USER_NAME, USER_NAME);
  }

  public  getUserUsername() {
    return localStorage.getItem(this.USER_NAME) as string;
  }



  isTokenValid() {
    const token = this.token;
    if (!token) {
      return false;
    }
    // decode the token
    const jwtHelper = new JwtHelperService();
    // check expiry date
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if (isTokenExpired) {
      localStorage.clear();
      return false;
    }
    return true;
  }

  isTokenNotValid() {
    return !this.isTokenValid();
  }

  get userRoles(): string[] {
    const token = this.token
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      this.email = decodedToken.sub;
      return decodedToken.authorities;
    }
    return [];
  }
}

