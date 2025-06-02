import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Delivery } from 'src/app/model/delivery';
import { UpdateDeliveryPositionRequest } from 'src/app/model/request/UpdateDeliveryPositionRequest';
import { CustomerLocation } from 'src/app/model/utils/customer-location';
import { Position } from 'src/app/model/utils/position';
import { DeliveryService } from 'src/app/service/delivery.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  delivery: Delivery = {
    latitude: 0,
    longitude: 0,
    benefice: 0,
    users: {
      id: 0,
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      imageUrl: '',
      fullName: '',
      username: ''
    },
    store: {
      id: 0,
      name: '',
      latitude: 0,
      longitude: 0,
      phoneNumber: '',
      email: '',
      address: '',
      active: false
    },
    busy: false
  }

  userLocation: CustomerLocation;

  currrentUserPosition: UpdateDeliveryPositionRequest ={
    latitude: 0,
    longitude: 0
  }

  isAdelivery$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  deliveryProfile: Delivery = {
    store: {
      id: 0,
      name: '',
      latitude: 0,
      longitude: 0,
      phoneNumber: '',
      email: '',
      address: '',
      active: false
    },
    users: {
      id: 0,
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      imageUrl: '',
      fullName: '',
      username: ''
    },
    benefice: 0,
    busy: false
  };

  constructor(
    private router: Router,
    private storeService: StoreService,
    private notifier: NotificationService,
    private deliveryService: DeliveryService,
    private location: Location) { }

  ngOnInit(): void {
    this.isAdelivery();

    this.getUserLocation();
    this.getDeliveryProfile();
   

  }

 
  onGoToCreateDelivery() {
    if (!this.isAdelivery$.value) {
      this.router.navigate(["/delivery/becomme-delivery"]);
    } else {
      this.notifier.onWarning('You have already');
    }

  }

  isAdelivery(): void {
    this.deliveryService.isAdelivery$().subscribe({
      next: (response) => {
        this.isAdelivery$.next(response.data.isDelivery);

      },
      error: (error) => {
        this.notifier.onInfo("Login if you want more access");
        console.error(error);
        this.router.navigate(["/login"])
      }
    });
  }


  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // this.request.latitude = position.coords.latitude;
        // this.request.longitude = position.coords.longitude;
        this.currrentUserPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.updateDeliveryPosition();
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }
  updateDeliveryPosition(): void {
    console.log(this.currrentUserPosition);
    this.deliveryService.updateDeliveryPosition$(this.currrentUserPosition).subscribe({
      next: (response) => {
        console.log(response);
        console.log("Delivery position updated");
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  getDeliveryProfile(): void {
    this.deliveryService.deliveryProfile$().subscribe({
      next: (response) => {
       this.deliveryProfile = response.data.delivery;
      },
      error: (error) => {
        this.notifier.onInfo("Login if you want more access");
        console.error(error);
        this.router.navigate(["/login"])
      }
    });
  }


  onGoToScan() {
    if (this.isAdelivery$.value) {
      this.router.navigate(["/delivery/scanner"]);
    } else {
      this.notifier.onWarning('You have not permission to');
    }
  }

  onGoToCustomerOrderList() {
    this.router.navigate(["/delivery/orders"])
  }

  onGoBack() {
    this.location.back();
  }


}
