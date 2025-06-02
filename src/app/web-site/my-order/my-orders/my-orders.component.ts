import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerOrder } from 'src/app/model/customerOrder';
import { OrderStatus } from 'src/app/model/enum/order-status';
import { DataState } from 'src/app/model/utils/data-state';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { CustomerService } from 'src/app/service/customer.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  

  customerOrderList: CustomerOrder[] = [];


  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  readonly orderStatus = OrderStatus;


  constructor(private location: Location, private router: Router, private customerService: CustomerService,
    private notifier: NotificationService, private customerOrderSecureService: CustomerOrderSecureService
  ) { }


  ngOnInit(): void {
    this.getMyOrder();
  }

  onGoBack() {
    this.location.back();
  }

  private getMyOrder(): void {
    this.appState = DataState.LOADING_STATE;
    this.customerService.getMyOrder$().subscribe(
      {
        next: (response) => {
          this.appState = DataState.LOADED_STATE;
          this.customerOrderList = response.data.page.content;
          this.notifier.onDefault(response.message);
        },
        error: (error) => {
          this.appState = DataState.ERROR_STATE;
          console.log(error);
        }
      }
    )
  }

  onDetails(customerOrderId: number) {
    
  }


}
