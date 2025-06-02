import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { CoonectStoresComponent } from '../coonect-stores/coonect-stores.component';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import { Store } from 'src/app/model/store';
import { StoreService } from 'src/app/service/storeService.service';
import { TokenService } from 'src/app/auth/token.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from 'src/app/service/delivery.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  imOwner: boolean = false;
  isAdelivery$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  username: string = '';
  errorState: boolean = false;
  deliveryErrorState: boolean = false;
  storeID: any;
  userId: any;

  latersDate: string | number | Date;
  store: Store = { createdAt: '', createdBy: '', id: 0, name: '', latitude: 0, longitude: 0, phoneNumber: '', email: '', address: '', active: true };

  constructor(private _bottomSheet: MatBottomSheet, private location: Location, private storeService: StoreService, private tokenService: TokenService,
    private notifier: NotificationService, private router: Router, private deliveryService: DeliveryService
  ) {
    this.latersDate = new Date();
  }


  ngOnInit(): void {
    this.username = this.tokenService.getUserUsername();
    this.storeID = this.storeService.getStoreID();
    this.isStoreOwner();this.isAdelivery();
  }


  onGoToMyStore() {
    const matBottomConfig = new MatBottomSheetConfig();
    matBottomConfig.data = this.store;
    this._bottomSheet.open(CoonectStoresComponent, matBottomConfig).afterDismissed().subscribe({});
  }

  onGoToDelivery() {
    if(!this.isAdelivery$.value){
      this.notifier.onWarning('You must be delivery');
      throw new Error('You must be delivery');
    }
    this.router.navigate(["/delivery"]);
  }

  /** We check if current user has delivery profile */
  isAdelivery(): void {
    this.deliveryService.isAdelivery$().subscribe({
      next: (response) => {
        this.isAdelivery$.next(response.data.isDelivery);
        console.log("Your are delivery :" +this.isAdelivery$.value);
        this.deliveryErrorState = false;
      },
      error: (error) => {
        this.notifier.onInfo("Login if you want more access");
        this.username = '';
        this.deliveryErrorState = true;
        console.error(error);
      },
      complete: () => { }
    });
  }



  /** We check if current user is owner of any store */
  isStoreOwner(): void {
    this.storeService.isStoreOwner$().subscribe({
      next: (response) => {
        this.imOwner = response.data.isStoreOwner;
        this.errorState = false;
      },
      error: (error) => {
        this.notifier.onInfo("Login if you want more access");
        this.username = '';
        this.errorState = true;
      },
      complete: () => { }
    });
  }

  onGoBack() {
    this.location.back();
  }
}
