import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataState } from 'src/app/model/utils/data-state';
import { Sale } from 'src/app/model/sale';
import { SaleItem } from 'src/app/model/sale-item';
import { SaleStatus } from 'src/app/model/sale-status';
import { Store } from 'src/app/model/store';
import { NotificationService } from 'src/app/service/notification.service';
import { SaleService } from 'src/app/service/sale.service';
import { StoreService } from 'src/app/service/storeService.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {

  readonly saleStatus = SaleStatus;
  saleItemList: SaleItem[] = [];
  saleList: Sale[] = [];
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

  constructor(private location: Location, private saleService: SaleService, private route: ActivatedRoute, private router: Router, private storeService: StoreService,
    private notifier: NotificationService
  ) { }

  ngOnInit(): void {
    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
  }

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.store = response.data.store;
        this.storeId = response.data.store.id; //update primary store key number
        this.getSale(response.data.store.id);
      },
      error: (error) => {
        this.notifier.onInfo('Not store found. Login again');
        console.error(error);

      }
    })
  }


  private getSale(storeId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.saleService.sales$(0, 10, storeId).subscribe({
      next: (response => {
        this.saleList = response.data.page.content;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        this.appState = DataState.ERROR_STATE;
      }
    });
  }


  private filterSale(storeId: number, page: number = 0, pageSize: number = 10): void {
    this.appState = DataState.LOADING_STATE;
    this.saleService.sales$(page, pageSize, storeId).subscribe({
      next: (response => {
        this.saleList = response.data.page.content;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        this.appState = DataState.ERROR_STATE;
      }
    });
  }


  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.filterSale(this.storeId, this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  onGoToSaleProduct() {
    this.router.navigate(['/admin/add-sale']);
  }

  onGoBack() {
    this.location.back();
  }
}
