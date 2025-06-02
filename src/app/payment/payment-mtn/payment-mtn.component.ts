import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CustomerOrderItem } from 'src/app/model/customerOrderItem';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { PaymentData } from 'src/app/model/request/payment-data';
import { DataState } from 'src/app/model/utils/data-state';
import { CustomerOrderService } from 'src/app/service/customer-order.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayementService } from 'src/app/service/payement.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-payment-mtn',
  templateUrl: './payment-mtn.component.html',
  styleUrls: ['./payment-mtn.component.css']
})
export class PaymentMTNComponent implements OnInit {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading.asObservable();
  amount: number = 0;
  customerPhone: string = '';
  currency = 'EUR';
  externalId = '';
  payerNumber = '';
  receiverNumber = ''; // Nouveau champ pour le bénéficiaire
  customerOrderId: number = 0;
  total: number = 0;

  appState: DataState = DataState.LOADED_STATE;
  readonly DataState = DataState;
  isFieldDisabled = true;
  paymentDone: boolean = false;

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
    },
    updatedBy: '',
    updatedAt: '',
    createdBy: '',
    createdDate: ''
  }


  storePhone: any;
  // paymentForm
  paymentMOMOForm: FormGroup<
    {
      payerNumber: FormControl<string>;
      amount: FormControl<number>;
    }>;

  paymentOMForm: FormGroup<
    {
      payerNumber: FormControl<string>;
      amount: FormControl<number>;
    }>;

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;
  storeId: number; //primary store key number
  payWithMTN: boolean = true;
  payWithOM: boolean = false;


  constructor(
    private paymentService: PayementService,
    private notifier: NotificationService,
    private route: ActivatedRoute,
    private customerOrderService: CustomerOrderService,
    private fbuilder: FormBuilder,
    private router: Router,
    private location:Location
  ) {
    this.paymentMOMOForm = this.fbuilder.group({
      payerNumber: [{ value: this.payerNumber, disabled: true }, [Validators.required]],
      amount: [{ value: this.amount, disabled: true }, [Validators.required, Validators.min(6500)]]
    });

    this.paymentOMForm = this.fbuilder.group({
      payerNumber: [{ value: this.payerNumber, disabled: true }, [Validators.required]],
      amount: [{ value: this.amount, disabled: true }, [Validators.required, Validators.min(6500)]]
    });

  }


  ngOnInit(): void {
    this.customerOrderId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getCustomerOrderItemByCustomerOrder(this.customerOrderId);

    

  }

  private getCustomerOrder() {
    for (const item of this.customerOrderItemList) {
      this.payerNumber = item.customerOrder.customer.phone;
      this.storePhone = item.customerOrder.store.phoneNumber;
      this.amount = item.customerOrder.total;
      this.customerOrderItem = item;
    }
  }

  private getCustomerOrderItemByCustomerOrder(customerOrderId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderService.getCustomerOrderItemByCustomerOrder$(customerOrderId).subscribe(
      {
        next: (response => {
          this.customerOrderItemList = response.data.customerOrderItems;
          this.getCustomerOrder();
          this.notifier.onDefault("Order loaded");
          this.appState = DataState.LOADED_STATE;
        }),
        error: (error => {
          this.appState = DataState.ERROR_STATE;
          console.error(error);
          this.notifier.onError("An error occured");
        })
      }
    )
  }

  initializeOMForm() {
    this.paymentOMForm = this.fbuilder.group({
      payerNumber: [{ value: this.payerNumber, disabled: true }, [Validators.required]],
      amount: [{ value: this.amount, disabled: true }, [Validators.required, Validators.min(6500)]]
    });
  }

  initializeMOMOForm() {
    this.paymentMOMOForm = this.fbuilder.group({
      payerNumber: [{ value: this.payerNumber, disabled: true }, [Validators.required]],
      amount: [{ value: this.amount, disabled: true }, [Validators.required, Validators.min(6500)]]
    });
  }
    


  onChooseOM() {
    this.initializeOMForm();
    this.getCustomerOrderItemByCustomerOrder(this.customerOrderId);
      this.payWithOM  = true ;
      this.payWithMTN  = false ;
  }
  onChooseMTN() {
    this.initializeMOMOForm();
    this.getCustomerOrderItemByCustomerOrder(this.customerOrderId);
    this.payWithMTN  = true ;
    this.payWithOM  = false ;
  }


  async makePaymentWithMOMO() {
    this.loading.next(true);
    const paymentData: PaymentData = {
      amount: this.amount,
      currency: 0,
      externalId: 0,
      payerNumber: this.payerNumber as any,
      receiverNumber: this.storePhone,
      customerOrderId: this.customerOrderId,
      storeId: this.customerOrderItem.customerOrder.store.id
    };

    try {
      const response = await this.paymentService.makePayment(paymentData);
      console.log('Payment successful');

      console.log(paymentData);
      this.notifier.onDefault("Payment successful");
      this.loading.next(false);
      this.customerOrderService.clearItems();
      this.seeInvoice(this.customerOrderId);
      this.paymentDone = true;
    } catch (error) {
      this.loading.next(false);
      console.error('Payment failed:', error.error.message);
      this.notifier.onError("Payment failed. Try again");
    }
  }


  async onMakePaymentOM() {
    this.loading.next(true);
    const paymentData: PaymentData = {
      amount: this.amount,
      currency: 0,
      externalId: 0,
      payerNumber: this.payerNumber as any,
      receiverNumber: this.storePhone,
      customerOrderId: this.customerOrderId,
      storeId: this.customerOrderItem.customerOrder.store.id
    };

    try {
      const response = await this.paymentService.makePayment(paymentData);
      console.log('Payment successful');

      console.log(paymentData);
      this.notifier.onDefault("Payment successful");
      this.loading.next(false);
      this.customerOrderService.clearItems();
      this.seeInvoice(this.customerOrderId);
      this.paymentDone = true;
    } catch (error) {
      this.loading.next(false);
      console.error('Payment failed:', error.error.message);
      this.notifier.onError("Payment failed. Try again");
    }
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

  onGoBack() {
    this.location.back();
    
  }


}
