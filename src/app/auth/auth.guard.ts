import { inject, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const authenticate = this.tokenService.isTokenValid();
    if (authenticate) {
      return true;
    }
    else {
      localStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }

  }

}