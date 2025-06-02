import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from 'src/app/model/store';
import { StoreOwner } from 'src/app/model/storeOwner';
import { DataState } from 'src/app/model/utils/data-state';
import { MessageModalService } from 'src/app/service/message-modal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.css']
})
export class StoreDetailsComponent implements OnInit {

  storeFound: Store = {
    id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
    email: '',
    address: '',
    active: false
  };
  onAddManagerToMyStore(arg0: any) {
    throw new Error('Method not implemented.');
  }

  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  private isUpdate: boolean = false;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  storeId: number = 0;
  storeOnerFound: StoreOwner = {
    createdAt: '',
    createdBy: '',
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
    guest: false,
    admin: false,
    accessRevoked: false
  };

  storeForm = this._formBuilder.group({
    enableStore: '',
  });

  constructor(private route: ActivatedRoute,
    private storeService: StoreService,
    private notifier: NotificationService,
    private router: Router,
    private alertService: MessageModalService,
    private location: Location,
    private _formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.storeId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getStoreOwnerByStoreId(this.storeId);

  }

  private getStoreOwnerByStoreId(storeId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.storeService.store$(storeId).subscribe({
      next: (response => {
        this.storeFound = response.data.store;
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


  SaveSetting(store: Store) {
    let enable;
    if(this.storeForm.value.enableStore == ''){
      enable = false
    }else{
      enable = this.storeForm.value.enableStore
    }
    this.save(enable,store.id);
  }

  save(enable: boolean,storeId: number) {
    this.loading.next(true);
    this.storeService.enableStore$(storeId,enable).subscribe(
      {
        next: (response) => {
          this.notifier.onSuccess(response.message);
          this.isUpdate = true;
          this.loading.next(false);
        },
        error: (error) => {
          console.error(error)
          this.loading.next(false);
          if (error) {
            this.notifier.onWarning(error.error.error);
          } 
        }
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
    } else {
      this.location.back();
    }
  }
}
