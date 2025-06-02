import { Component } from '@angular/core';
import { Delivery } from 'src/app/model/delivery';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DataState } from 'src/app/model/utils/data-state';
import { NotificationService } from 'src/app/service/notification.service';
import { ProductService } from 'src/app/service/product.service';
import { StoreService } from 'src/app/service/storeService.service';
import { Location } from '@angular/common';
import { DeliveryService } from '../../../service/delivery.service';
import { Store } from 'src/app/model/store';


@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent {

  storeID: string = '';
  deliverys: Delivery[] = [];
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
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


  constructor(private location: Location,
    private deliverService: DeliveryService,
    private router: Router,
    private storeService: StoreService,
    private notifier: NotificationService
  ) { }

  ngOnInit(): void {
    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
  }


  /** @param uuid List product form this store*/
  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.store = response.data.store;
        this.storeId = response.data.store.id;
        this.getDeliveryByStore(response.data.store.id);
      },
      error: (error) => {
        this.notifier.onInfo('Not store found. Login again');
        console.error(error);
      }
    });
  }



  private getDeliveryByStore(storeId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.deliverService.getDeliveryByStore$(0, 10, storeId).subscribe(
      {
        next: (response) => {
          this.deliverys = response.data.page.content;
          this.appState = DataState.LOADED_STATE;
        },
        error: (error) => {
          console.error(error);
          this.notifier.onError("oops an error occured while retrived deliverys");
          this.appState = DataState.ERROR_STATE;
        }
      }
    )
  }





  private filterDeliverys(storeId: number, page: number, pageSize: number ): void {
    this.appState = DataState.LOADING_STATE;
    this.deliverService.getDeliveryByStore$(page, pageSize, storeId).subscribe({
      next: (response => {
        this.deliverys = response.data.page.content;
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



  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.filterDeliverys(this.storeId, this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  


  onGoToAddProduct() {
    this.router.navigate(['/admin/add-product']);
  }

  onGoBack() {
    this.location.back();
  }

}
