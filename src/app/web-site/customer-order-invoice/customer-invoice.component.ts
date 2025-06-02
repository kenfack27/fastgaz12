import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';




import { CustomerOrderItem } from 'src/app/model/customerOrderItem';
import { DataState } from 'src/app/model/utils/data-state';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { CustomerOrderService } from 'src/app/service/customer-order.service';
import { NotificationService } from 'src/app/service/notification.service';
import { GeneratePDFService } from '../../service/generate-pdf.service';

@Component({
  selector: 'app-customer-invoice',
  templateUrl: './customer-invoice.component.html',
  styleUrls: ['./customer-invoice.component.css']
})
export class CustomerInvoiceComponent implements OnInit {

  customerOrderId: number = 0;
  qrcodeImgeUrl: string = "";
  total: number = 0;
  appState: DataState = DataState.LOADED_STATE;
  // appState: DataState = ;
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
    },
    updatedBy: '',
    updatedAt: '',
    createdBy: '',
    createdDate: ''
  }

  constructor(
    private location: Location,
    private notifier: NotificationService,
    private customerOrderService: CustomerOrderService,
    private route: ActivatedRoute,
    private generatePDFService:GeneratePDFService
  ) { }


  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get("id"));

    this.getCustomerOrderItemByCustomerOrder(id);


  }

  private getCustomerOrder() {
    for (const item of this.customerOrderItemList) {
      this.total = item.customerOrder.total;
      this.customerOrderItem = item;
      this.qrcodeImgeUrl = item.customerOrder.qrcode;
    }
  }

  private getCustomerOrderItemByCustomerOrder(customerOrderId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderService.getCustomerOrderItemByCustomerOrder$(customerOrderId).subscribe(
      {
        next: (response => {
          this.customerOrderItemList = response.data.customerOrderItems;
          this.getCustomerOrder();
          this.notifier.onDefault(response.message);
          this.appState = DataState.LOADED_STATE;
        }),
        error: (error => {
          this.appState = DataState.ERROR_STATE;
          console.error(error)
          this.notifier.onError("An error occured");
        })
      }
    )
  }


  exportToPDF() {
    const content = document.getElementById('content-to-export-in-pdf',);
    this.generatePDFService.generatePdf('content-to-export-in-pdf','invoice-'+ this.customerOrderItem.uuiId + '.pdf')
    this.notifier.onDefault('Invoices downloaded');
  }

  onGoBack() {
    this.location.back();
  }

}





