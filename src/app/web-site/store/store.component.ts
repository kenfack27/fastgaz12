import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderItem } from 'src/app/model/customerOrderItem';
import { Product } from 'src/app/model/product';
import { CustomerOderItemRequest } from 'src/app/model/request/customer-order-request';
import { DataState } from 'src/app/model/utils/data-state';
import { CustomerOrderService } from 'src/app/service/customer-order.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProductService } from 'src/app/service/product.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  productList: Product[] = [];
  items: number = 0;
   appState: DataState = DataState.LOADING_STATE;
    readonly DataState = DataState;

  customerOrderItems: CustomerOrderItem[] = [];

  request: CustomerOderItemRequest = {
    product: {
      name: '',
      buyPrice: 0,
      price: 0,
      priceWithPackaging: 0,
      alertThreshold: 0,
      store: undefined,
      quantity: 0
    },
    quantity: 0,
    withPackaging: false,
    price: 0,
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


  constructor(
    private location: Location,
    private router: Router,
    private productService: ProductService,
    private notifier: NotificationService,
    private activateRoute: ActivatedRoute,
    private customerOrderService: CustomerOrderService,
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {
    const storeId = this.activateRoute.snapshot.paramMap.get("id");
    this.getProductsByStore(storeId);
    // this.getCustomerOrderItems();
  }

  selectProduct() {
  }


  onSelectGaz(product: Product): void {
    this.request.product = product;
    this.request.price = product.price;
    this.request.quantity = 1;
    this.request.store = product.store;
    // this.router.navigate(["/service/order/", 1]);
    const currentItems = this.getCustomerOrderItems();
    // this.submitOrder(this.request);
    this.submitOrderNew(this.request,product,currentItems)
    
  }



   private submitOrderNew(request: CustomerOderItemRequest, product: Product, currentItems: CustomerOrderItem[]): void {
      // Get current items
      // Find existing item

      if(this.customerOrderItems.length != 0){
            return;
      }
  
      const existingItem = currentItems.find(item => item.product?.name === product.name);
        // Create new order item
        const newOrderItem: CustomerOrderItem = {
  
          
          createdDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          quantity: request.quantity,
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
  
        // console.log(this.customerOrderItems)
        this.items = this.customerOrderItems.length;

        this.notifier.onDefault("Product added")
    }



  private getCustomerOrderItemsOld(): void {
    this.customerOrderItems = this.customerOrderService.getCurrentOrder();
    this.items = this.customerOrderItems.length;
  }

  private getCustomerOrderItems(): CustomerOrderItem[] {
    this.customerOrderItems = this.customerOrderService.getCurrentOrder();
    this.items = this.customerOrderItems.length;
    return this.customerOrderItems;
  }

  onCheckout() {
    this.router.navigate(["/service/order-item"]);
  }

  onGoBack() {
    this.location.back();
  }
  
  goForward() {
    this.location.forward(); // Navigate forward to the next URL
  }

  goBack() {
    this.location.back(); // Navigate back to the previous URL
  }

  private getProductsByStore(storeId: any): void {
    this.appState = DataState.LOADING_STATE;
    this.productService.productList$(storeId).subscribe(
      {
        next: (response) => {
          this.appState = DataState.LOADED_STATE;
          this.productList = response.data.products;
          if(this.productList.length === 0){
            this.notifier.onWarning("No products found in this store");
          }
        },
        error: (error) => {
          console.error(error);
          this.appState = DataState.ERROR_STATE;
          this.notifier.onError("Cannot fetch product");
        }
      }
    )
  }


}