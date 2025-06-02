import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProductRequest } from 'src/app/model/request/product-request';
import { Store } from 'src/app/model/store';
import { StoreProduct } from 'src/app/model/store-product';
import { MessageModalService } from 'src/app/service/message-modal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProductService } from 'src/app/service/product.service';
import { StoreProductService } from 'src/app/service/store-product.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private isUpdate: boolean = false;
  private storeID: string = '';
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
  productForm = this.fbuilder.group({
    name: ['', [Validators.required]],
    buyPrice: [0, [Validators.required, Validators.min(5600)]],
    price: [0, [Validators.required, Validators.min(6500)]],
    priceWithPackaging: [0, [Validators.required, Validators.min(15000)]],
    alertThreshold: [0, [Validators.required, Validators.min(5)]],
  });

  storeProductList: StoreProduct[] = [];
  productRequest: ProductRequest = {
    name: '', buyPrice: 0, price: 0, priceWithPackaging: 0, quantity: 0, image: "", alertThreshold: 0, store: {
      createdAt: '',
      createdBy: '',
      id: 0,
      name: '',
      latitude: 0,
      longitude: 0,
      phoneNumber: '',
      email: '',
      address: '',
      active: true
    }
  };

  constructor(private location: Location,
    private fbuilder: FormBuilder,
    private notifier: NotificationService,
    private alertService: MessageModalService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private storeService: StoreService,
    private storeProductService: StoreProductService
  ) { }



  ngOnInit(): void {

    this.storeID = this.storeService.getStoreID();
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.store = response.data.store;
      },
      error: (error) => {
        this.notifier.onInfo('Not store found. Login again');
        console.error(error);
      }
    });

    this.getStoresProduct();
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

  onChosseProduct($event: MatSelectChange) {
    this.productRequest.image = $event.value.image as any;
    this.productRequest.name = $event.value.name as any;
    console.log($event.value.image);
  }

  onSaveProduct() {
    this.productRequest.alertThreshold = this.productForm.value.alertThreshold;
    this.productRequest.buyPrice = this.productForm.value.buyPrice;
    this.productRequest.price = this.productForm.value.price;
    this.productRequest.priceWithPackaging = this.productForm.value.priceWithPackaging;
    this.productRequest.store = this.store;

    this.productRequest.quantity = 0;
    console.log(this.productRequest);
    this.createProduct(this.productRequest);
  }

  createProduct(productRequest: ProductRequest): void {
    this.loading.next(true);
    this.productService.create$(productRequest).subscribe(
      {
        next: (response) => {
          this.notifier.onSuccess(response.message);
          this.isUpdate = true;
          this.loading.next(false);
          this.productForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.loading.next(false);
          if (error.error.validationError) {
            this.notifier.onWarning(error.error.validationError);

          } else {
            this.notifier.onWarning(error.error.validationError);
          }
          if (error.error.errorCode === 100) {
            this.notifier.onError("Product name cannot be empty");
          }
          if (error.error.errorCode === 101) {
            this.notifier.onError("Product buy price cannot be empty");
          }
          if (error.error.errorCode === 102) {
            this.notifier.onError("Product buy price cannot be empty");
          }
          if (error.error.errorCode === 103) {
            this.notifier.onError(" Packaging Price cannot be empty");
          }

          if (error.error.errorCode === 105) {
            this.notifier.onError("Alert threshold cannot be empty");
          }
          if (error) {
            this.notifier.onError("An error occured")
          }
          this.isUpdate = false;
          if (error) {
            this.notifier.onError("An error occured. Try again")
          }
        },
        complete: () => { this.loading.next(false); }
      });
  }


  private getStoresProduct(): void {
    // this.appState = DataState.LOADING_STATE;
    this.storeProductService.productList$().subscribe(
      {
        next: (response => {
          // this.appState = DataState.LOADED_STATE;
          this.storeProductList = response.data.storeProducts;
          // this.notifier.onDefault(response.message);
        }),
        error: (error => {
          // this.appState = DataState.ERROR_STATE;
          this.notifier.onError("An error occure. We cannot fetch product");
        })
      }
    )
  }

}