import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RegistrationRequest } from 'src/app/model/request/registrationRequest';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthService } from '../auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Position } from 'src/app/model/utils/position';

@Component({
  selector: 'app-basic-register',
  templateUrl: './basic-register.component.html',
  styleUrls: ['./basic-register.component.css']
})
export class BasicRegisterComponent implements OnInit {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private _userLocation: { lat: number; lng: number; };
  position:Position = {
    lat: 0,
    lng: 0
  }
  
  
  public get userLocation(): { lat: number; lng: number; } {
    return this._userLocation;
  }
  public set userLocation(value: { lat: number; lng: number; }) {
    this._userLocation = value;
  }

  authReq: RegistrationRequest = {
    lastName: '', firstName: '', email: '', password: '', latitude: 0, longitude: 0,
    phone: '',address: ''
  }
  
  registerForm = this.fbuilder.group({
    phone: ['', [Validators.required,Validators.minLength(9)]],
    email: ['', [Validators.email, Validators.required]],
    address: ['', [Validators.required]],
  });

  constructor(private fbuilder: FormBuilder, private authService: AuthService,
    private notifier: NotificationService,
    private router: Router,
    public dialogRef: MatDialogRef<BasicRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistrationRequest,
  ) { }



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
        this.position.lat = position.coords.latitude;
        this.position.lng = position.coords.longitude;
       
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }


  public onRegister(): void {
    this.authReq.email = this.registerForm.value.email;
    this.authReq.lastName = this.authReq.email;
    this.authReq.firstName = this.authReq.email;
    this.authReq.password = "password";
    this.authReq.address = this.registerForm.value.address;
    this.authReq.phone = this.registerForm.value.phone as any;
    this.authReq.latitude = this.position.lng;
    this.authReq.longitude = this.position.lat;
    console.log(this.authReq);
    this.loading.next(true);
    this.authService.registerBasicUser$(this.authReq).subscribe
      (
        {
          next: (response) => {
            this.notifier.onDefault('Informations saved');
            this.dialogRef.close(this.authReq);
          },
          error: (error: HttpErrorResponse) => {
            this.loading.next(false);
            if (error.error.validationError) {
              this.notifier.onWarning(error.error.validationError);
              this.loading.next(false);
              this.dialogRef.close();
            } else {
              this.notifier.onWarning(error.error.validationError);
            }
          },
          complete: () => { this.loading.next(false); }
        }
      )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveBasicUser() {
   this.onRegister();
  
  }
}
