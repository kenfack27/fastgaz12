import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CustomerOrder } from 'src/app/model/customerOrder';
import { CustomerOrderItem } from 'src/app/model/customerOrderItem';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { Store } from 'src/app/model/store';
import { DataState } from 'src/app/model/utils/data-state';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { MessageModalService } from 'src/app/service/message-modal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  storeID: any;
  customerOrderId: any;
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
  customerOrderItemList: CustomerOrderItem[] = [];

  customerOrderItem: CustomerOrderItem = {
    createdAt: '',
    quantity: 0,
    price: 0,
    withPackaging: false,
    customerOrder: {
      createdAt: '',
      orderStatus: OrderStatus.PENDING,
      qrcode: '',
      transactionId: '',
      deliveryFee: 0,
      amount: 0,
      total: 0,
      customer: {
        createdAt: '',
        phone: '',
        email: '',
        latitude: undefined,
        longitude: undefined
      },
      store: {
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
      },
      wasAssignToDelivery: false,
      latitude: 0,
      longitude: 0,
      feeDelivered: false
    },
    product: {
      name: '',
      buyPrice: 0,
      price: 0,
      priceWithPackaging: 0,
      alertThreshold: 0,
      store: {
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
      },
      quantity: 0
    },
    store: {
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
  }
  readonly orderStatus = OrderStatus;

  customerOrder: CustomerOrder = {
    createdAt: '',
    orderStatus: OrderStatus.PENDING,
    qrcode: '',
    transactionId: '',
    deliveryFee: 0,
    amount: 0,
    total: 0,
    customer: undefined,
    store: undefined,
    wasAssignToDelivery: false,
    latitude: 0,
    longitude: 0,
    feeDelivered: false
  }
  total: number = 0;
  deliveryFee: number = 0;
  withPackaging: boolean = false;
  willBeDelivered: string = 'No';
  isUpdate: boolean = false;
  messageError: string = '';



  constructor(
    private location: Location, private notifier: NotificationService,
    private customerOrderSecureService: CustomerOrderSecureService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private alertService: MessageModalService
  ) { }


  ngOnInit(): void {
    this.customerOrderId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.getCustomerOrderItemByCustomerOrder(this.customerOrderId);

  }

  private findCustomerOrder() {
    for (const item of this.customerOrderItemList) {
      this.total = item.customerOrder.total;
      this.customerOrderItem = item;
      this.withPackaging = item.withPackaging;
      this.deliveryFee = item.customerOrder.deliveryFee;
      this.customerOrder = item.customerOrder;
    }

    if (this.deliveryFee > 0) {
      this.willBeDelivered = "Yes"
    }

  }

  private getCustomerOrderItemByCustomerOrder(customerOrderId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderSecureService.getCustomerOrderByCustomerOrderId$(customerOrderId).subscribe(
      {
        next: (response => {
          this.appState = DataState.LOADED_STATE;
          this.customerOrderItemList = response.data.customerOrderItems;
          this.notifier.onDefault(response.message);
          this.findCustomerOrder();
        }),
        error: (error => {
          console.error(error)
          this.appState = DataState.ERROR_STATE;
          this.notifier.onError("An error occured");
        })
      }
    )
  }

  onApproveCustomerOrder(customerOrder: CustomerOrder) {
    if (customerOrder === null) {
      this.notifier.onInfo("Cannot perfom this action");
      throw new Error("Cannot perfom this action");
    }
    this.loading.next(true);
    this.customerOrderSecureService.approveByDelivery$(customerOrder).subscribe(
      {
        next: (response => {
          this.loading.next(false);
          this.notifier.onSuccess(response.message);
          this.isUpdate = true;
          this.location.back();
        }),
        error: (error => {
          this.loading.next(false);
          if (error) {
            this.notifier.onError(error.error.error);
            console.log(error.error.error);
            this.messageError = error.error.error;
          }
        })
      }
    )
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
