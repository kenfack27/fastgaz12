import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DeliveryRequest } from 'src/app/model/request/delivery-request';
import { Store } from 'src/app/model/store';
import { CustomerLocation } from 'src/app/model/utils/customer-location';
import { Position } from 'src/app/model/utils/position';
import { DeliveryService } from 'src/app/service/delivery.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.css']
})
export class AddDeliveryComponent implements OnInit {

  userLocation: CustomerLocation;
  currrentUserPosition: Position = {
      lat: 0,
      lng: 0
    }
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private isUpdate: boolean = false;
  storeList: Store[] = [];
  deliveryForm = this.fb.group({
    storeName: ["", [Validators.required]],
    agree: ["", [Validators.required]]
  });
  request: DeliveryRequest = {
    storeId: 0
  };

  constructor(private location: Location,
    private fb: FormBuilder,
    private notifier: NotificationService,
    private storeService: StoreService,
    private deliveryService: DeliveryService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getStores();
    this.getUserLocation();
  }

  onSave() {
    this.request.storeId = this.deliveryForm.value.storeName as any;
    this.save(this.request);
    this.router.navigate(["/delivery"]);
  }

  private getStores(): void {
    this.storeService.getAllActiveStore$().subscribe(
      {
        next: (response => {
          this.storeList = response.data.stores;
          this.notifier.onDefault(response.message);
        }),
        error: (error => {
          this.notifier.onError("Connot find store");
        })
      }
    )
  }


  private save(request: DeliveryRequest): void {
    this.loading.next(true);
    this.deliveryService.becommeDelivery$(request).subscribe({
      next: (response => {
        this.notifier.onInfo(response.message)
        this.loading.next(false);

      }),
      error: (error) => {
        this.loading.next(false);
        if (error) {
          console.error(error.error.error)
          this.notifier.onError(error.error.error);
        }
      },
      complete: () => { this.loading.next(false); }
    });
  }

  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.request.latitude = position.coords.latitude;
        this.request.longitude = position.coords.longitude;
        this.currrentUserPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }


  onGoBack() {
    this.location.back();
  }


}
