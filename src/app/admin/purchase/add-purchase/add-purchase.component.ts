import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/model/product';
import { PurchaseRequest } from 'src/app/model/request/purchase-request';
import { MessageModalService } from 'src/app/service/message-modal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProductService } from 'src/app/service/product.service';
import { PurchaseService } from 'src/app/service/purchase.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private isUpdate: boolean = false;
  productList: Product[] = [];
  private storeIdUIID: string = '';
  private storeId: number = 0;

  private purchaseRequest: PurchaseRequest = {
    product: undefined,
    quantity: 0,
    store: undefined,
    amount: 0
  }

  puchaseForm = this.fb.group({
    product: [{},Validators.required],
    quantity: [0, [Validators.required, Validators.min(3)]]
  })

  constructor(private location: Location, private notifier: NotificationService, private alertService: MessageModalService,
    private productService: ProductService, private storeService: StoreService, private purchaseService: PurchaseService, private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.storeIdUIID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeIdUIID);

  }

  onSelectProduct($event: MatSelectChange) {
    const selectedProduct = $event.value;
    console.log(selectedProduct);

    if (!selectedProduct || !selectedProduct.store || !selectedProduct.price) {
      console.error('Invalid product selection:', selectedProduct);
      return;
    }

    this.purchaseRequest = {
      store: selectedProduct.store,
      product: selectedProduct,
      quantity: 1,
      amount: 0
    };
  }

  /**
   * The ptoduct quantity will be update after this operation.
   */
  onPurchase(): void {
    const quantity = this.puchaseForm.value.quantity;
    const price = this.purchaseRequest.product.buyPrice;

    const oldQuantity = this.purchaseRequest.product.quantity;
    // old quantity + the provided quantity
    const newQuantity = quantity + oldQuantity;
    const amount = price;

    this.purchaseRequest.product.quantity = newQuantity;
    this.purchaseRequest.quantity = quantity;
    this.purchaseRequest.amount = amount;
    this.saveNewPurchase(this.purchaseRequest)
    
  }

  saveNewPurchase(request: PurchaseRequest): void {
    this.loading.next(true);
    this.purchaseService.addToCart$(request).subscribe({
      next: (response => {
        this.notifier.onDefault(response.message);
        this.loading.next(false);
        this.puchaseForm.reset();
        this.isUpdate = true;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        this.loading.next(false);
      }
    });
  }

  getProducts(storeId: number): void {
    this.productService.products$(storeId).subscribe(
      {
        next: (response) => {
          this.productList = response.data.products
        },
        error: (error) => {
          console.error(error);
          this.notifier.onError("Cannot retrived product");
        }
      }
    )
  }

  /**
   * @param uuid List product form this store
   */
  getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeIdUIID).subscribe({
      next: (response) => {
        this.getProducts(response.data.store.id);
        this.storeId = response.data.store.id;
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        console.error(error);

      }
    });
  }

  onGoBack(): void {
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
