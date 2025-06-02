import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/model/payment';
import { DataState } from 'src/app/model/utils/data-state';
import { PayementService } from '../../../service/payement.service';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/service/storeService.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Location } from '@angular/common';
import { Store } from 'src/app/model/store';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {

  paymentList: Payment[] = [];
  storeID: any;
  private store: Store = {
    createdAt: '',
    createdBy: '',
    id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
    email: '',
    address: '',
    active: false
  }

  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;

  constructor(private location: Location,
    private payementService: PayementService,
    private router: Router, private storeService: StoreService,
    private notifier: NotificationService,
  ) { }

  ngOnInit(): void {
    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
  }

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.store = response.data.store;
        this.getPayments(response.data.store.id);
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        console.error(error);
      }
    });
  }


  private getPayments(storeId: number): void {
    this.appState = DataState.LOADING_STATE;
    // this.payementService.paymentByStore$(0, 100, storeId).subscribe({
    this.payementService.paymentByStore$(storeId).subscribe({
      next: (response => {
        this.paymentList = response.data.payments;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        if (error) {
          this.appState = DataState.ERROR_STATE
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }

  onGoToPurchaseProduct() {
    this.router.navigate(['/admin/add-purchase']);
  }

  onGoBack() {
    this.location.back();
  }

}
