import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { BasicRegisterComponent } from 'src/app/auth/basic-register/basic-register.component';
import { CustomerOrderItem } from 'src/app/model/customerOrderItem';
import { DataState } from 'src/app/model/utils/data-state';
import { Delivery } from 'src/app/model/delivery';
import { CustomerOderConfirmationRequest } from 'src/app/model/request/customer-oder-confirmation-request';
import { RegistrationRequest } from 'src/app/model/request/registrationRequest';
import { CustomerOrderService } from 'src/app/service/customer-order.service';
import { DeliveryService } from 'src/app/service/delivery.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DeliveryDistance } from 'src/app/model/utils/delivery-distance';
import { HaversineCalculatorService } from 'src/app/service/haversine-calculator.service';
import { DeliveryNoSecureService } from 'src/app/service/delivery-no-secure.service';
import { Position } from 'src/app/model/utils/position';
import { CustomerLocation } from 'src/app/model/utils/customer-location';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {
  email: string;
  phone: string;
  message: string = "";
  customerOrderId: number = 0;
  quantity: number = 1;
  isFeeDelivered: boolean = false;
  isWithPackaging: boolean = false;
  // appState: DataState = DataState.LOADED_STATE;
  appState: DataState;
  readonly DataState = DataState;
  deliveryList: Delivery[] = [];
  userLocation: { lat: number; lng: number; };



  customerOrderItemList: CustomerOrderItem[] = [];

  items: number = 0;
  confirmationRequest: CustomerOderConfirmationRequest = {
    storeId: 0,
    deliveryFee: 0,
    packageFee: 0,
    withPackaging: false,
    userEmail: '',
    customerLatitude: 0,
    customerLongitude: 0,
    isFeeDelivered: false,
    delivery: {
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
      benefice: 0,
      store: undefined,
      busy: false
    },
  }
  deliveryFee: number = 0;
  total: number = 0;
  packagingPrice: number = 0;

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
      },
      busy: false
    }
  }
  loadingDistance: boolean = false;
  error = '';
  currrentUserPosition: Position = {
    lat: 0,
    lng: 0
  }
  nearDeliveryFound: Delivery = {
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
    benefice: 0,
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
    busy: false
  };

  constructor(
    private router: Router, private location: Location,
    private notifier: NotificationService,
    private customerOrderService: CustomerOrderService,
    public dialog: MatDialog,
    private deliveryService: DeliveryService,
    private deliverNosecureService: DeliveryNoSecureService,
    private haversineService: HaversineCalculatorService
  ) { }


  ngOnInit(): void {
    this.getCustomerOrderItems();
    this.getUserLocation();
  }

  onChoosePackaging($event: MatRadioChange) {
    if ($event.value == 1) {
      this.confirmationRequest.withPackaging = true;
      this.customerOrderItemList.forEach(element => {
        this.packagingPrice = element.product.priceWithPackaging;
        element.withPackaging = true;
      });

    } else {
      this.packagingPrice = 0;
    }
    this.isWithPackaging = true;

    console.log(" packaging " + this.confirmationRequest.withPackaging);
  }



  // Get customer comfrmation. If he to be delivery.
  onChooseDelivery($event: MatRadioChange) {
    if ($event.value == 1) {
      this.confirmationRequest.deliveryFee = 500;
      this.confirmationRequest.isFeeDelivered = true;
    }
    else {
      this.confirmationRequest.deliveryFee = 0;
      this.confirmationRequest.isFeeDelivered = false;
    }
    // Track to if is selected or not
    this.isFeeDelivered = true;
    console.log(" delivery " + this.confirmationRequest.isFeeDelivered);
  }

  

  // Clean the cart item list.
  onRemove(): void {
    this.customerOrderService.clearItems();
    this.customerOrderService.clearToCart$().subscribe(
      {
        next: (response => {
          this.notifier.onDefault(response.message);
          this.getCustomerOrderItems();
        }),
        error: (error => {
          this.notifier.onError("An error occure. Please reload");
        })
      }
    )
  }


  // Get another confirmation from customer about the order process.
  onCheckOut(): void {

    if (!this.isFeeDelivered) {
      this.notifier.onError("Select all these requiere field")
      throw new Error('Select all these requiere field');
    }

    if (!this.isWithPackaging) {
      this.notifier.onError("Select all these requiere field");
      throw new Error("Select all these requiere field");
    }
    this.openModaleDialogFormToCreateUser();
  }

  private openModaleDialogFormToCreateUser(): void {
    let authReq: RegistrationRequest = {
      lastName: '', firstName: '', email: '', password: '', latitude: 0, longitude: 0,
      phone: ''
    }
    const dialogRef = this.dialog.open(BasicRegisterComponent, {
      width: '500px',
      data: authReq,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result.email;

      this.confirmationRequest.userEmail = this.email;
      this.confirmationRequest.customerLatitude = result.latitude;
      this.confirmationRequest.customerLongitude = result.longitude;
      this.confirmationRequest.items = this.customerOrderItemList;


      // 
      this.comfirmYourOrder(this.confirmationRequest);

      this.customerOrderService.clearItems();
    });
  }


  private getCustomerOrderItems(): void {
    this.customerOrderItemList = this.customerOrderService.getCurrentOrder();
    console.log("================================================")
    console.log(this.customerOrderItemList);
    console.log("================================================")


    this.items = this.customerOrderItemList.length;
    let storeId = 0;
    for (const cart of this.customerOrderItemList) {
      storeId = cart.store.id;
      this.getAllActiveDelivery(storeId);

    }

    this.confirmationRequest.storeId = storeId;


  }



  private comfirmYourOrder(request: CustomerOderConfirmationRequest): void {
    this.appState = DataState.LOADING_STATE;
    // const delivery = this.findDeliveryThatIsNearCustomer();
    console.log("=================request===============================")
    console.log(request);
    console.log("==================request==============================")

    console.log("check id delivery is present");
    this.customerOrderService.confirm$(request).subscribe(
      {
        next: (response => {
          this.message = response.message;
          this.appState = DataState.LOADED_STATE;
          this.customerOrderId = response.data.customerOrder.id;
          this.notifier.onSuccess(response.message);
          this.confirmPaymentInfo(this.customerOrderId);
        }),
        error: (error => {
          this.appState = DataState.ERROR_STATE;

          this.notifier.onWarning(error.error.error);
          if (error.error.error) {
            this.message = error.error.error;
          }
          this.notifier.onError("You order has been not confirmed");
        })
      }
    )
  }



  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      },
      (error) => {
        this.notifier.onError("We are not able to access your localisation.")
        console.error('Error getting user location:', error);
      }
    );
  }


  private getUserLocationNew(): Promise<CustomerLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to get your location'));
          this.notifier.onWarning('Unable to get your location');
          this.message = "Unable to get your location";
        }
      );
    });
  }



  public getAllActiveDelivery(storeId: number): void {
    this.deliverNosecureService.noActivedeliveryList$(storeId).subscribe({
      next: (response) => {
        this.inactiveDeliveryList = response.data.deliveries;

        // console.log("No Active delivery found");
        console.log(this.inactiveDeliveryList);
        this.findNearestDeliveryHaversine(this.inactiveDeliveryList);
      },
      error: (error) => {
        this.notifier.onError('No active delivery found. PLease try again later.');
        console.error(error);
      }
    });
  }


  async findNearestDeliveryHaversine(deliveries: Delivery[]): Promise<void> {
    this.loadingDistance = true;
    this.error = '';
    // const userLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
    try {
      const userLocation = await this.getUserLocationNew();



      if (this.inactiveDeliveryList.length === 0) {
        this.nearestDelivery = null;
        this.nearDeliveryFound = null;
        this.confirmationRequest.delivery = null;

        console.log(`Neares delivery found----->`);

        console.log(this.nearDeliveryFound);
      } else {
        this.nearestDelivery = this.haversineService.findNearestDelivry(userLocation, this.inactiveDeliveryList);
        this.nearDeliveryFound = this.nearestDelivery.delivery;
        this.confirmationRequest.delivery = this.nearestDelivery.delivery;

        console.log(`Neares delivery found----->`);

        console.log(this.nearDeliveryFound);
      }




    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An error occurred';
      console.error(error);
    } finally {
      this.loadingDistance = false;
    }
  }






  confirmPaymentInfo(customerOrderId: number): void {
    this.router.navigate(["payment-mtn/", this.customerOrderId]);
  }

  onGoBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward(); // Navigate forward to the next URL
  }

  onSeeInvoice(): void {
    if (this.customerOrderId === 0) {
      this.notifier.onError("An error occured");
      throw new Error("An error occured");
    }
    this.seeInvoice(this.customerOrderId);
  }

  seeInvoice(customerOrderId: number): void {
    this.router.navigate(["service/customer-invoice/", this.customerOrderId]);
  }




}


