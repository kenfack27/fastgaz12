import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/model/store';
import { StoreService } from 'src/app/service/storeService.service';
import { StoreComponent } from '../../../web-site/store/store.component';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { DataState } from 'src/app/model/utils/data-state';
import { NotificationService } from 'src/app/service/notification.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreUpdateRequest } from 'src/app/model/request/store-update-request';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MessageModalService } from 'src/app/service/message-modal.service';

@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.css']
})
export class StoreProfileComponent implements OnInit {



  store: Store = {
    id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
    email: '',
    address: '',
    active: false
  };
  storeID: any;

  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  readonly orderStatus = OrderStatus;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private isUpdate: boolean = false;

  storeForm = this.fbuilder.group({
    name: ['', [Validators.required]],
    phoneNumber: ['', [Validators.min(9), Validators.required]],
    // email: ['', [Validators.email, Validators.required]],
    address: ['', [Validators.required, Validators.required]]
    // approveOrder: [false],
  });

  request: StoreUpdateRequest = { name: '', phoneNumber: '', email: '', address: '', id: 0, approveOrder: false}

  constructor(private location: Location, private storeService: StoreService,
    private notifier: NotificationService, private fbuilder: FormBuilder,
    private alertService: MessageModalService
  ) { }


  ngOnInit(): void {
    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
  }


  getMyStores(id: number): void {
    this.appState = this.DataState.LOADING_STATE;
    this.storeService.store$(id).subscribe({
      next: (response) => {
        this.store = response.data.store;
        this.request.id = this.store.id;//set store id to the requested store
        console.log(this.request.id)
        this.appState = this.DataState.LOADED_STATE;
      },
      error: (error) => {
        console.error(error);
        this.notifier.onError('Not store found. Login again or reaload');
        this.appState = this.DataState.ERROR_STATE;
      },
      complete: () => { }
    })
  }



  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.getMyStores(response.data.store.id);
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        console.error(error);
      }
    });
  }


  onApproveChange($event: MatSlideToggleChange) {
    this.request.approveOrder = $event.source.checked;
    console.log("value changed " + this.request.approveOrder);
  }


  onSaveCreate() {
    this.request.email = this.store.email ;
    this.request.name = this.storeForm.value.name?.trim() || this.store.name;
    this.request.phoneNumber = this.storeForm.value.phoneNumber?.trim() || this.store.phoneNumber ;
    this.request.address = this.storeForm.value.address?.trim() || this.store.address;
    

    this.confirmation();
    console.log(this.request.id);
    // this.updateStore(this.request);
  }

  updateStore(request: StoreUpdateRequest): void {
    this.loading.next(true);
    this.storeService.update$(request).subscribe(
      {
        next: (response) => {
          this.notifier.onSuccess(response.message);
          this.isUpdate = true;
          this.loading.next(false);
        },
        error: (error) => {
          this.loading.next(false);
          if (error.error.validationError) {
            this.notifier.onWarning(error.error.validationError);
            this.loading.next(false);
          } else {
            // this.notifier.onWarning(error.error.validationError);
            if (error.error.errorCode === 108) {
              this.notifier.onError("Phone number must have 9 number");
            }
            
            if (error.error.errorCode === 105) {
              this.notifier.onError("Email not the rigtht format");
            }
          }
        
          this.isUpdate = false;
          this.loading.next(false);
        },
        complete: () => { this.loading.next(false); }
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


  confirmation() {
    this.alertService.confirmMessage("Do you want to save this change ?");
    this.alertService.checkDiscaseValueAfterCloseModale$().subscribe(
      {
        next: response => {
          if (response) {
            this.alertService.updateValue();
            console.log(this.request);
            this.updateStore(this.request);
          } else {
            console.error("Noting")
          }
        },
        error: (err: any) => {
          console.error("An error occurred", err);
      }
      }
    )
  }

}