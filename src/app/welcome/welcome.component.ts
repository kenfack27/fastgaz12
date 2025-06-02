import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { StoreService } from '../service/storeService.service';
import { Store } from '../model/store';
import { StoreProduct } from '../model/store-product';
import { StoreProductService } from '../service/store-product.service';
import { CustomerOrderItem } from '../model/customerOrderItem';
import { CustomerOrderItemRequestNoStore } from '../model/request/customer-order-item-request-no-store';
import { CustomerOrderService } from '../service/customer-order.service';
import { DataState } from '../model/utils/data-state';
import { Product } from '../model/product';
import { Position } from '../model/utils/position';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../service/loading.service';
import { StoreNotSecureService } from '../service/store-not-secure.service';
import { BehaviorSubject } from 'rxjs';
import { StoreDistance } from '../model/utils/store-distance';
import { GooleMapCalculatorService } from '../service/goole-map-calculator.service';
import { HaversineCalculatorService } from '../service/haversine-calculator.service';
import { CustomerLocation } from '../model/utils/customer-location';
import { OrderStatus } from '../model/enum/order-status';
import { GoogleMapsCalculatorTwoService } from '../service/google-maps-calculator-two.service';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  appState2: DataState = DataState.LOADING_STATE;
  readonly DataState2 = DataState;
  items: string | number = 0;
  customerOrderItems: CustomerOrderItem[] = [];
  currrentUserPosition: Position = {
    lat: 0,
    lng: 0
  }

  // 
  request: CustomerOrderItemRequestNoStore = {
    productName: '',
    quantity: 1,
    price: 0,
    withPackaging: false,
    latitude: 0,
    longitude: 0,
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

  storeById: Store = {
    id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
    email: '',
    address: '',
    active: false
  }

  //   Create 
  productByProductName: Product = {
    id: 0,
    name: '',
    buyPrice: 0,
    price: 0,
    priceWithPackaging: 0,
    alertThreshold: 0,
    store: undefined,
    quantity: 0
  }

  // 
  storeList: Store[] = [];

  nearestStore: StoreDistance = {
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
    distance: 0
  };
  loadingDistance: boolean = false;
  error = '';

  storeProductList: StoreProduct[] = [];
  activeStore: Store[] = [];
  calculationMethod: string;
  userLocation: CustomerLocation;
  allStores: StoreDistance[] = [];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;

  constructor(private router: Router, private notifier: NotificationService,
    private storeService: StoreService, private storeProductService: StoreProductService,
    private customerOrderService: CustomerOrderService, private datePipe: DatePipe,
    private loadingService: LoadingService,
    private storeServiceNoSecure: StoreNotSecureService,
    private haversineService: HaversineCalculatorService,
    private googleMapsService: GooleMapCalculatorService,
    private googleMapsTwoService: GoogleMapsCalculatorTwoService
  ) {


  }

  ngOnInit(): void {

    // this.findNearestStoreHaversine();
    // this.findNearestStoreGoogleMaps();
    this.getCurrentLocationAndFindStores();

    // active store list
    this.getAllActiveStores();

    // Get list of stores
    this.getStores();
    this.getStoresProduct();

    // this.getUserLocation();
    this.customerOrderService.clearItems();

  }

  private getCustomerOrderItems(): CustomerOrderItem[] {
    this.customerOrderItems = this.customerOrderService.getCurrentOrder();
    this.items = this.customerOrderItems.length;
    return this.customerOrderItems;
  }



  private getStores(): void {
    this.appState2 = DataState.LOADING_STATE;
    this.storeService.storeList$(0, 30).subscribe(
      {
        next: (response => {
          this.appState2 = DataState.LOADED_STATE;
          this.storeList = response.data.page.content;
        }),
        error: (error => {
          this.appState2 = DataState.LOADED_STATE;
          this.notifier.onError("Connot load store");
        })
      }
    )
  }


  private filterStores(page: number = 0, pageSize: number = 10): void {
    this.appState2 = DataState.LOADING_STATE;
    this.storeService.storeList$(page, pageSize).subscribe(
      {
        next: (response => {
          this.appState2 = DataState.LOADED_STATE;
          this.storeList = response.data.page.content;
        }),
        error: (error => {
          this.appState2 = DataState.LOADED_STATE;
          this.notifier.onError("Connot load store");
        })
      }
    )
  }




  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.filterStores(this.pageIndex, this.pageSize);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  // List default products
  private getStoresProduct(): void {
    this.appState = DataState.LOADING_STATE;
    this.storeProductService.productList$().subscribe(
      {
        next: (response => {
          this.appState = DataState.LOADED_STATE;
          this.storeProductList = response.data.storeProducts;

        }),
        error: (error => {
          this.appState = DataState.ERROR_STATE;
          this.notifier.onError("Connot find store");
        })
      }
    )
  }


  // Find this product in the store id and call submit method to add product to the cart
  private getProductByName(productName: string, storeId: number): void {
    this.loading.next(true);
    this.customerOrderService.getProductByName$(productName, storeId).subscribe(
      {
        next: (response => {
          this.productByProductName = response.data.product;
          const product = response.data.product;
          const currentItems = this.getCustomerOrderItems();


          this.submitOrderNew(this.request, product, currentItems);
          // this.notifier.onDefault(response.message);
          this.loading.next(false);

        }),
        error: (error => {
          this.loading.next(false);

          this.notifier.onWarning("Product not found. Please try again.");

          let errorCounters = 1;
          if (error) {
            errorCounters += 1;
          }

          if (errorCounters === 2) {
            this.notifier.onInfo("Try another way by selecting the store");
          }
          console.log("Error count: " + errorCounters);
        })
      }
    )
  }


  onAddToCart(product: StoreProduct) {

    this.request.productName = product.name;
    this.request.quantity = 1;
    this.request.image = product.image;
    // this.request.price = product.price;
    // this.getStoreById(this.pickRandomNumberBetween(this.activeStore.length), this.request.productName);


    this.getProductByName(this.request.productName, this.nearestStore.store.id);

  }


  // adding product to cart
  private submitOrderNew(request: CustomerOrderItemRequestNoStore, product: Product, currentItems: CustomerOrderItem[]): void {
    this.customerOrderItems.pop();
    const existingItem = currentItems.find(item => item.product?.name === product.name);


    if(this.customerOrderItems.length != 0){
        throw new Error(" Cannot add more product");
    }

    if (existingItem) {
      // If product exists, do nothing to prevent duplicate
      return;
    } else {
      const newOrderItem: CustomerOrderItem = {
        createdDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        quantity: 1, // Always set to 1
        price: product.price,
        withPackaging: false,
        customerOrder: undefined,
        product: {
          id: product.id,
          name: product.name,
          buyPrice: product.buyPrice,
          price: product.price,
          priceWithPackaging: product.priceWithPackaging,
          alertThreshold: 0,
          store: product.store,
          quantity: 0,
          image: product.image
        },
        store: product.store
      };

      

      this.customerOrderItems.push(newOrderItem);

      this.customerOrderService.saveCurrentOrder(this.customerOrderItems);
      this.items = this.customerOrderItems.length;

      // console.log(newOrderItem);
    }
    this.items = this.customerOrderItems.length;
    this.notifier.onDefault("Product added");
  }


  private getAllActiveStores(): void {
    this.storeServiceNoSecure.getAllActiveStore$().subscribe(
      {
        next: (response => {
          this.activeStore = response.data.stores;
          this.notifier.onDefault(response.message);
        }),
        error: (error => {
          this.notifier.onError("Connot find store");
        })
      }
    )
  }


  onCheckout() {
    this.router.navigate(["/service/order-item"]);
  }


  onGoToStore(storeId: any): void {
    this.router.navigate(["service/store/", storeId]);
  }


  goToLoginPage() {
    this.router.navigate(["/login"]);
  }

  private getUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.request.latitude = position.coords.latitude;
        this.request.longitude = position.coords.longitude;
        this.currrentUserPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      },
      (error) => {
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
          this.notifier.onWarning('Unable to get your location')
        }
      );
    });
  }


  // async findNearestStoreHaversine(): Promise<void> {
  //   this.loadingDistance = true;
  //   this.error = '';
  //   // const userLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  //   try {
  //     const userLocation = await this.getUserLocationNew();
  //     this.nearestStore = this.haversineService.findNearestStore(userLocation, this.activeStore);
  //     console.log(`Nearest  ----->`);
  //     console.log(this.nearestStore);

  //   } catch (error) {
  //     this.error = error instanceof Error ? error.message : 'An error occurred';
  //   } finally {
  //     this.loadingDistance = false;
  //   }
  // }


  async findNearestStoreGoogleMaps(): Promise<void> {
    console.log('Google Maps')
    this.loadingDistance = true;
    this.error = '';
    this.calculationMethod = 'Google Maps';

    try {
      const userLocation = await this.getUserLocationNew();

      console.log('current user location');
      console.log(userLocation);

      this.googleMapsService.findNearestStore(userLocation, this.activeStore)
        .subscribe({
          next: (result) => {
            this.nearestStore = result;
            this.loadingDistance = false;
            console.log(` store whith short distance `);
            console.log(this.nearestStore);
          },
          error: (error) => {
            this.error = error instanceof Error ? error.message : 'An error occurred';
            this.loadingDistance = false;
          }
        });
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An error occurred';
      this.loadingDistance = false;
    }
  }








  // =======================================================
  formatDuration(seconds?: number): string {
    if (!seconds) return 'N/A';

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // step 2

  async getCurrentLocationAndFindStores(): Promise<void> {
    this.loadingDistance = true;
    this.error = '';
    this.nearestStore = null;
    this.allStores = [];
    this.userLocation = null;

    try {
      // Get user's current location from browser
      const position = await this.getCurrentPosition();

      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      console.log('User location obtained:', this.userLocation);

      // Find nearest stores using the user's location
      this.findNearestStore2(this.userLocation);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An error occurred getting your location';
      this.loadingDistance = false;
      console.error('Location error:', error);
    }
  }

  // step 2: create

  findNearestStore2(location: CustomerLocation): void {
    // First get all distances
    this.googleMapsTwoService.calculateAllDistances(location, this.activeStore)
      .subscribe({
        next: (results) => {
          this.allStores = results;

          // The nearest store is the first one in the sorted results
          if (results.length > 0) {
            this.nearestStore = results[0];
            console.log('Nearest store:', this.nearestStore);
          }

          this.loadingDistance = false;
        },
        error: (error) => {
          this.error = error instanceof Error ? error.message : 'An error occurred calculating distances';
          this.loadingDistance = false;
          console.error('Distance calculation error:', error);
        }
      });
  }

  // step 4

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      // Options for more accurate positioning
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0 // Don't use cached position
      };

      navigator.geolocation.getCurrentPosition(
        position => {
          console.log('Raw position from browser:', position);
          resolve(position);
        },
        error => {
          console.error('Geolocation error:', error);
          reject(new Error(`Unable to get your location: ${error.message}`));
        },
        options
      );
    });
  }


  clearCache(): void {
    this.googleMapsTwoService.clearCache();
    this.error = '';
    this.nearestStore = null;
    this.allStores = [];
  }


}

