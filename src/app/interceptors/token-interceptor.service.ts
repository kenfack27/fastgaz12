import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.auth.getAuthToken();
      if(req.url.includes(this.auth.URL)){
        return next.handle(req);
      }
      if(req.url.includes("/stores/no-secure-store")){
        return next.handle(req);
      }
      if(req.url.includes("/product/no-secure/store")){
        return next.handle(req);
      }
      if(req.url.includes("/customer/order")){
        return next.handle(req);
      }

      if(req.url.includes("/store-product")){
        return next.handle(req);
      }

      if(req.url.includes("/payments")){
        return next.handle(req);
      }

      if(req.url.includes("/no-secure-store")){
        return next.handle(req);
      }
      if(req.url.includes("/password")){
        return next.handle(req);
      }
      
      if(req.url.includes("/no-secure-delivery")){
        return next.handle(req);
      }
    // Clone the request to add the new header
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next.handle(clonedRequest)
  }
}
