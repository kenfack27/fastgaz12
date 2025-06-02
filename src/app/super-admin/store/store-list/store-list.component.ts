import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/model/store';
import { DataState } from 'src/app/model/utils/data-state';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {

  myStoreList: Store[] = [];
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;


  constructor(private location: Location, private storeService: StoreService,
    private notifier: NotificationService
  ) { }


  ngOnInit(): void {
    this.getAllStore();
  }


  private getAllStore(): void {
    this.appState = DataState.LOADING_STATE;
    this.storeService.AllStoreList$(0, 30).subscribe(
      {
        next: (response) => {
          console.log(response);
          this.myStoreList = response.data.page.content;
          this.appState = DataState.LOADED_STATE;
        },
        error: (error) => {
          console.error(error);
          this.notifier.onError("Cannot fetch all store");
          this.appState = DataState.ERROR_STATE;
        }
      }
    )
  }

  onGoBack() {
    this.location.back();
  }
}
