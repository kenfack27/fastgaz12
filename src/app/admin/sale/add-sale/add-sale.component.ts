import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/model/product';
import { SaleItem } from 'src/app/model/sale-item';
import { SaleRequest } from 'src/app/model/request/sale-request';
import { MessageModalService } from 'src/app/service/message-modal.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProductService } from 'src/app/service/product.service';
import { SaleService } from 'src/app/service/sale.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent implements OnInit {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  private isUpdate: boolean = false;
  productList: Product[] = [];
  private storeIdUIID: string = '';
  private storeId: number = 0;

  items: number = 0;
  disableConfirmButton: boolean = false;
  private saleRequest: SaleRequest = {
    product: {
      createdAt: '',
      createdBy: '',
      id: 0,
      name: '',
      buyPrice: 0,
      price: 0,
      priceWithPackaging: 0,
      alertThreshold: 0,
      store: undefined,
      quantity: 0
    },
    quantity: 0,
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
  };
  carts: SaleItem[] = [];


  constructor(private location: Location, private notifier: NotificationService, private alertService: MessageModalService,
    private productService: ProductService, private route: ActivatedRoute, private storeService: StoreService, private saleService: SaleService
  ) { }

  ngOnInit(): void {
    this.storeIdUIID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeIdUIID);

  }


  /**
   * @param $event When product is selected we can acces the from here.
   * Optional: You can change MatSelectChange ---->Product type.
   */
  onSelectProduct($event: MatSelectChange) {
    this.disableConfirmButton = true;
    const selectedProduct = $event.value;

    if (!selectedProduct || !selectedProduct.store || !selectedProduct.price) {
      console.error('Invalid product selection:', selectedProduct);
      return;
    }
    this.saleRequest = {
      store: selectedProduct.store,
      product: selectedProduct,
      price: selectedProduct.price,
      quantity: 1
    };

    // Debugging: Uncomment for development debugging
    // console.log('Sale request before adding to cart:', this.saleRequest.product);
    this.addToCart(this.saleRequest);

  }


  //  add new item
  addToCart(request: SaleRequest): void {

    this.saleService.addToCart$(request).subscribe({
      next: (response => {
        this.notifier.onDefault(response.message)
        this.items = response.data.saleItems.length;
        this.carts = response.data.saleItems;
        this.loading.next(false)
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        this.loading.next(false);
      }
    });
  }
  // confirm on click
  onConfirmSale(): void {
    // Trigger
    this.confirmSale(this.storeId);

  }

  private confirmSale(storeId: number): void {
    this.loading.next(true);
    this.saleService.confirm$(storeId).subscribe({
      next: (response => {
        this.notifier.onInfo(response.message)
        this.loading.next(false);
        this.onClear();
        this.isUpdate = true;
      }),
      error: (error) => {
        this.loading.next(false);
        console.error(error);
        if (error) {
          this.notifier.onError("This product is not in the stock")
        } else {
          this.notifier.onError("Oups! something whent wrong !");
        }
      },
      complete: () => { this.loading.next(false); }
    });
  }

  // clear
  onClear(): void {
    this.saleService.clearToCart$().subscribe({
      next: (response => {
        this.items = 0;
        this.carts = [];
        this.notifier.onDefault(response.message);
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
      }
    });

  }

  private getProducts(storeId: number): void {
    this.productService.productsInMyStore$(0, 50, storeId).subscribe(
      {
        next: (response) => {
          this.productList = response.data.page.content;
        },
        error: (error) => {
          console.error(error);
          this.notifier.onError("Cannot fetch product");
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
