import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DataState } from 'src/app/model/utils/data-state';
import { Store } from 'src/app/model/store';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';
import { CustomerOrder } from 'src/app/model/customerOrder';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-custor-order-list',
  templateUrl: './custor-order-list.component.html',
  styleUrls: ['./custor-order-list.component.css']
})
export class CustorOrderListComponent implements OnInit {
  customerOrderList: CustomerOrder[] = [];
  // 
  storeID: any; //uuid format. This is used to not be cripted by anyone
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
    active: false,
  }

  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  readonly orderStatus = OrderStatus;

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;
  storeId: number; //primary store key number
  messageError: string = "";


  constructor(private location: Location, private router: Router, private storeService: StoreService,
    private notifier: NotificationService, private customerOrderSecureService: CustomerOrderSecureService
  ) { }

  ngOnInit(): void {
    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
  }

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.store = response.data.store;
        this.storeId = response.data.store.id;
        this.getCustomerOrderByStore(response.data.store.id);
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        console.error(error);
      }
    });
  }


  private getCustomerOrderByStore(storeId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderSecureService.customerOrderListForStore$(0, 10, storeId).subscribe({
      next: (response => {
        this.customerOrderList = response.data.page.content;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        this.messageError = error.error.error;
        if (error) {
          this.appState = DataState.ERROR_STATE
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }

  private filterCustomerOrder(storeId: number, page: number = 0, pageSize: number = 10): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderSecureService.customerOrderListForStore$(page, pageSize, storeId).subscribe({
      next: (response => {
        this.customerOrderList = response.data.page.content;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        this.messageError = error.error.error;
        if (error) {
          this.appState = DataState.ERROR_STATE
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }


  onCancelOrder(orderId: number): void {
    // Implement order cancellation logic

  }


  onDetails(customerOrderId: number) {
    this.router.navigate(["/admin/customer-order/", customerOrderId])
  }

  onGoToPurchaseProduct() {
    this.router.navigate(['/admin/add-purchase']);
  }




  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.filterCustomerOrder(this.storeId, this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  onGoBack() {
    this.location.back();
  }


  // Method to determine CSS class based on order status
  getOrderStatusClass(status: OrderStatus): string {
    return `order-status-badge-${status}`;
  }


}
