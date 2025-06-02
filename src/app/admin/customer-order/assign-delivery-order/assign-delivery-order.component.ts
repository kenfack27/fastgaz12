import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CustomerOrder } from 'src/app/model/customerOrder';
import { CustomerOrderItem } from 'src/app/model/customerOrderItem';
import { Delivery } from 'src/app/model/delivery';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { ApproveCustomerOrder } from 'src/app/model/request/request-approave-order';
import { Store } from 'src/app/model/store';
import { DataState } from 'src/app/model/utils/data-state';
import { DeliveryDistance } from 'src/app/model/utils/delivery-distance';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { DeliveryService } from 'src/app/service/delivery.service';
import { HaversineCalculatorService } from 'src/app/service/haversine-calculator.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-assign-delivery-order',
  templateUrl: './assign-delivery-order.component.html',
  styleUrls: ['./assign-delivery-order.component.css']
})
export class AssignDeliveryOrderComponent implements OnInit {

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
    customer: {
      createdAt: '',
      phone: '',
      email: '',
      latitude: 0,
      longitude: 0
    },
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
  messageError: string = null;
  messageSuccess: string = null;

  inactiveDeliveryList: Delivery[] = [];
  nearestDelivery: DeliveryDistance = {
    distance: 0,
    delivery: {
      latitude: 0,
      longitude: 0,
      benefice: 0,
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
      }
      ,
      busy: false
    }
  }
  loadingDistance: boolean = false;
  error = '';

  request: ApproveCustomerOrder = {
    delivery: {
      latitude: 0,
      longitude: 0,
      benefice: 0,
      users: {
        id: 0,
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        imageUrl: '',
        fullName: '',
        username: '',
        latitude: 0,
        longitude: 0
      },
      store: undefined,
      busy: false
    },
    customerOrder: {
      createdAt: '',
      orderStatus: OrderStatus.PENDING,
      qrcode: '',
      transactionId: '',
      deliveryFee: 0,
      amount: 0,
      total: 0,
      customer: {
        latitude: undefined,
        longitude: undefined,
        phone: ''
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
      wasAssignToDelivery: false,
      latitude: 0,
      longitude: 0,
      feeDelivered: false
    }
  }

  constructor(
    private location: Location,
    private notifier: NotificationService,
    private customerOrderSecureService: CustomerOrderSecureService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private router: Router,
    private deliverService: DeliveryService,
    private haversineService: HaversineCalculatorService
  ) { }


  ngOnInit(): void {
    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
    const id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.customerOrderId = id;
  }


  private findCustomerOrder() {
    for (const item of this.customerOrderItemList) {
      this.total = item.customerOrder.total;
      this.customerOrderItem = item;
      this.withPackaging = item.withPackaging;
      this.deliveryFee = item.customerOrder.deliveryFee;
      this.customerOrder = item.customerOrder;

      this.request.customerOrder = item.customerOrder;
    }


    if (this.deliveryFee > 0) {
      this.willBeDelivered = "Yes"
    }

  }

  private getCustomerOrderItemByCustomerOrder(customerOrderId: number, storeId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderSecureService.getCustomerOrderItemByCustomerOrderInStore$(customerOrderId, storeId).subscribe(
      {
        next: (response => {
          this.appState = DataState.LOADED_STATE;
          this.customerOrderItemList = response.data.customerOrderItems;
          // this.notifier.onDefault(response.message);
          this.findCustomerOrder();
        }),
        error: (error => {
          this.appState = DataState.ERROR_STATE;
          this.notifier.onError("An error occured");
          console.error(error);
          this.router.navigate(['/login']);
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
    this.customerOrderSecureService.assignDelivery$(customerOrder).subscribe(
      {
        next: (response => {
          this.loading.next(false);
          this.notifier.onSuccess("well assigned delivery");
          this.messageSuccess = "well assigned delivery";
          this.getCustomerOrderItemByCustomerOrder(this.customerOrderId, this.store.id);
        }),
        error: (error => {
          this.loading.next(false);
          this.notifier.onWarning(error.error.error);
          this.messageError = error.error.error;
          // this.notifier.onError("An error occured");
        })
      }
    )

  }



  onGoBack() {
    this.location.back();
  }


  

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.store = response.data.store;
        this.getAllActiveDelivery(this.store.id);
        this.getCustomerOrderItemByCustomerOrder(this.customerOrderId, this.store.id);
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        console.error(error);
        this.router.navigate(['/login']);
      }
    });
  }



  private getAllActiveDelivery(storeId: number): void {
    this.deliverService.noActivedeliveryList$(storeId).subscribe({
      next: (response) => {
        this.inactiveDeliveryList = response.data.deliveries;
        console.log("no Active")
        console.log(this.inactiveDeliveryList);
        this.findNearestDeliveryHaversine(this.inactiveDeliveryList);
      },
      error: (error) => {
        this.notifier.onError('No active delivery found. PLease try again later.');
        console.error(error.error.error);
      }
    });
  }


  async findNearestDeliveryHaversine(deliveries: Delivery[]): Promise<void> {
    this.loadingDistance = true;
    this.error = '';

    try {
      const userLocation = {
        lat: this.customerOrder.customer.latitude,
        lng: this.customerOrder.customer.longitude,
      };
      this.nearestDelivery = this.haversineService.findNearestDelivry(userLocation, this.inactiveDeliveryList);
      console.log(`Nearest  DELIVERY----->`);
      console.log(this.nearestDelivery);
      this.request.delivery = this.nearestDelivery.delivery;

    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An error occurred';
      console.error(error);
    } finally {
      this.loadingDistance = false;
    }
  }

}


