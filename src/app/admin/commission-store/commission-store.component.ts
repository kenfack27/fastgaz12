import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommissionStore } from 'src/app/model/commission-store';
import { DataState } from 'src/app/model/utils/data-state';
import { CommissionService } from 'src/app/service/commission.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-commission-store',
  templateUrl: './commission-store.component.html',
  styleUrls: ['./commission-store.component.css']
})
export class CommissionStoreComponent implements OnInit {

  storeID: any;
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  commissionStores: CommissionStore[] = [];

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


  constructor(private location: Location,
    private commissionService: CommissionService,
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
        this.getCommission(response.data.store.id);
      },
      error: (error) => {
        this.notifier.onInfo('Not store found. Login again');
        console.error(error);
      }
    });
  }

  private getCommission(storeId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.commissionService.getCommisionByStore$(storeId).subscribe(
      {
        next: (response) => {
          this.commissionStores = response.data.commissionStores;
          this.appState = DataState.LOADED_STATE;
          this.notifier.onDefault(response.message);
        },
        error: (error) => {
          console.error(error);
          this.notifier.onError("Cannot fetch product");
          this.appState = DataState.ERROR_STATE;
        }
      }
    )
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    // this.filterInventories(this.storeId, this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }


  onGoBack() {
    this.location.back();
  }
}
