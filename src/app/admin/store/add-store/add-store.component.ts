import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { StoreRequest } from 'src/app/model/request/storeRequest';
import { MessageModalService } from 'src/app/service/message-modal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CustomerLocation } from 'src/app/model/utils/customer-location';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.css']
})
export class AddStoreComponent implements OnInit {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private isUpdate: boolean = false;

  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  selectPosition: CustomerLocation = {
    lat: 0,
    lng: 0
  }



  storeForm = this.fbuilder.group({
    name: ['', [Validators.required]],
    phoneNumber: ['', [Validators.min(9), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    address: ['', [Validators.required, Validators.required]],
    userEmail: ['', [Validators.email, Validators.required]],
  });

  storeRequest: StoreRequest = { name: '', latitude: 0, longitude: 0, email: '', phoneNumber: '', userEmail: '', address: '' };

  constructor(private location: Location, private fbuilder: FormBuilder, private notifier: NotificationService, private alertService: MessageModalService,
    private storeService: StoreService, private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserLocation();
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
    this.storeRequest.latitude = event.latLng.toJSON().lat;
    this.storeRequest.longitude = event.latLng.toJSON().lng;

    this.selectPosition = {
      lat: event.latLng.toJSON().lat,
      lng: event.latLng.toJSON().lng
    }
    console.log("selected %o", this.selectPosition);
  }



  onSaveCreate() {
    this.storeRequest.email = this.storeForm.value.email;
    this.storeRequest.name = this.storeForm.value.name;
    this.storeRequest.phoneNumber = this.storeForm.value.phoneNumber;
    this.storeRequest.userEmail = this.storeForm.value.userEmail;
    this.storeRequest.address = this.storeForm.value.address;

    if (this.selectPosition.lat === 0 && this.selectPosition.lng === 0) {
      this.getUserLocation();

    } else {
      this.storeRequest.latitude = this.selectPosition.lat;
      this.storeRequest.longitude = this.selectPosition.lng;
      this.center = { lat: this.selectPosition.lat, lng: this.selectPosition.lng };
      console.log("selected %o", this.selectPosition);
    }

    console.log("new store %o", this.storeRequest)

    this.createStore(this.storeRequest);
  }


  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        if (!navigator.geolocation) {
          new Error('Geolocation is not supported by your browser');
          return;
        }

        this.storeRequest.latitude = position.coords.latitude;
        this.storeRequest.longitude = position.coords.longitude;
        this.center = { lat: position.coords.latitude, lng: position.coords.longitude };

        console.log("default %o", this.storeRequest);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }

  createStore(storeRequest: StoreRequest): void {
    this.loading.next(true);
    this.storeService.create$(storeRequest).subscribe(
      {
        next: (response) => {
          this.notifier.onSuccess(response.message);
          this.isUpdate = true;
          this.loading.next(false);
          this.storeForm.reset();
          this.router.navigate(["/service"])
        },
        error: (error: HttpErrorResponse) => {
          this.loading.next(false);
          if (error.error.validationError) {
            this.notifier.onWarning(error.error.validationError);
            this.loading.next(false);
          } else { 
            // this.notifier.onWarning(error.error.validationError);
          }
          if (error.error.errorCode === 50) {
            this.notifier.onError("Store field name cannot be empty");
          }
          if (error.error.errorCode === 101) {
            this.notifier.onError("You can't register to store a the same location");
          }
          if (error.error.errorCode === 103) {
            this.notifier.onError("Phone number cannot be empty or null");
          }
          if (error.error.errorCode === 105) {
            this.notifier.onError("Email not the right format");
          }
          
          if (error.error.errorCode === 107) {
            this.notifier.onError("Email not the right format");
          }
          if (error.error.errorCode === 106) {
            this.notifier.onError("Address number cannot be empty");
          }
          if (error.error.errorCode === 108) {
            this.notifier.onError("Phone number must have 9 number ");
          }
          this.isUpdate = false;
          this.loading.next(false);
        },
        complete: () => { this.loading.next(false); }
      });
  }


  onGoBack() {

    if (!this.isUpdate) {
      this.alertService.confirmMessage("Do you want to discase the change ?");
      this.alertService.checkDiscaseValueAfterCloseModale$().subscribe(
        {
          next: response => {
            if (response) {
              this.alertService.updateValue();
              this.location.back();
            } else {
            }
          }
        }
      )
    }

  }

}
