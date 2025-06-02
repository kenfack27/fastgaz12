import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';
import { AuthenticationRequest } from 'src/app/model/request/authentication-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();

  loginForm = this.fbuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
  });

  private userLocation: { lat: number; lng: number };

  constructor(private fbuilder: FormBuilder, private authService: AuthService, private notifier: NotificationService, private router: Router, private tokenServce: TokenService) { }


  public onLogin(): void {
    localStorage.clear();
    this.loading.next(true);
    this.authService.login$(this.loginForm.value as AuthenticationRequest).subscribe
      (
        {
          next: (response) => {
            this.notifier.onSuccess(response.message);
            this.tokenServce.setAuthToken(response.data.token.token as string);
            this.tokenServce.setUserFakeID(response.data.token.uuid);
            this.tokenServce.setUserName(response.data.token.username);
            this.router.navigate(["/service"]);
          },
          error: (error: HttpErrorResponse) => {
            this.loading.next(false);
            if (error.error.validationError) {
              this.notifier.onWarning(error.error.validationError);
            } else {
              // this.notifier.onWarning(error.error.validationError);
            }
            if (error.error.errorCode === 3005) {
              this.notifier.onError("Username or password incorret ");
            }
            if (error.error.errorCode === 3003) {
              this.notifier.onError("Your account is disabled");
            } 
            if (error.error.errorCode === 3004) {
              this.notifier.onError("Your account is disabled");
            }
          },
          complete: () => { this.loading.next(false); }
        }
      )

  }

  updateConnectedUserPosition():void{

  }

  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
       
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }

}
