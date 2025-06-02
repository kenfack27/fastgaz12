import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthService } from '../auth.service';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistrationRequest } from 'src/app/model/request/registrationRequest';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private userLocation: { lat: number; lng: number };

  authReq: RegistrationRequest = {
    lastName: '', firstName: '', email: '', password: '', latitude: 0, longitude: 0,
    phone: ''
  }
  registerForm = this.fbuilder.group({
    phoneNumber:['', [Validators.min(9), Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
  });

  constructor(private fbuilder: FormBuilder,
     private authService: AuthService, 
    private notifier: NotificationService, 
    private router: Router) { }


  ngOnInit(): void {
    this.getUserLocation();
  }

  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.authReq.latitude = position.coords.latitude;
        this.authReq.longitude = position.coords.longitude;
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }


  public onRegister(): void {
    this.authReq.email=this.registerForm.value.email;
    this.authReq.lastName=this.registerForm.value.lastName;
    this.authReq.phone=this.registerForm.value.phoneNumber;
    this.authReq.password=this.registerForm.value.password;
    this.loading.next(true);
    this.authService.register$(this.authReq).subscribe
      (
        {
          next: (response) => {
            this.notifier.onSuccess('Account created.');
            this.notifier.onDefault('Check your email to enable your account"');
          },
          error: (error) => { 

            if(error.error){
              this.notifier.onError(error.error.error)
            }

            if(error.error.validationError){
              this.notifier.onWarning(error.error.validationError);
            }
            else{
              console.log(error.error.error)
              // this.notifier.onWarning(error.error.validationError);
            }
            this.loading.next(false);
          },
          complete: () => {this.loading.next(false); }
        }
      )
    
  }


}


