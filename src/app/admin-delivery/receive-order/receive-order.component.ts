import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenService } from 'src/app/auth/token.service';
import { DataState } from 'src/app/model/utils/data-state';
import { Delivered } from 'src/app/model/delivered';
import { Delivery } from 'src/app/model/delivery';
import { Store } from 'src/app/model/store';
import { Users } from 'src/app/model/users';
import { DeliveredService } from 'src/app/service/delivered.service';
import { DeliveryService } from 'src/app/service/delivery.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';
import { OrderStatus } from 'src/app/model/enum/order-status';

@Component({
  selector: 'app-receive-order',
  templateUrl: './receive-order.component.html',
  styleUrls: ['./receive-order.component.css']
})
export class ReceiveOrderComponent implements OnInit {
  appState: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  readonly orderStatus = OrderStatus;
  userId: any;
  storeId: any;
  store: Store;
  deliveryId: any;
  delivery: Delivery;
  users: Users = {
    id: 0,
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    imageUrl: '',
    fullName: '',
    username: '',
  };
  deliveredList: Delivered[] = [];

  constructor(private location: Location, private router: Router, private storeService: StoreService,
    private notifier: NotificationService, private deliveredService: DeliveredService, private authService: AuthService,
    private tokenService: TokenService, private deliveryService: DeliveryService
  ) { }

  ngOnInit(): void {
    this.userId = this.tokenService.gettUserFakeID();
    this.getUserById(this.userId);
  }

  onGoBack() {
    this.location.back();
  }

  getUserById(uuid: string): void {
    this.authService.usersUUID$(uuid).subscribe(
      {
        next: (response) => {
          this.users = response.data.user;
          this.findDeliveryByUser(this.users.id);

        },
        error: (error) => {
          console.error(error);
          this.router.navigate(["/login"]);
          this.notifier.onError("Oups an error occured");
        }
      }
    )
  }


  onDetails(customerOrderId: number) {
    this.router.navigate(["/delivery/orders/", customerOrderId])
  }


  findDeliveryByUser(usersId: number): void {
    this.deliveryService.findDeliveryByUser$(usersId).subscribe(
      {
        next: (response) => {
          this.delivery = response.data.delivery;
          this.getDelivedList(this.delivery.store.id, this.delivery.id)
        },
        error: (error) => {
          console.error(error);
          this.notifier.onError("Oups an error occured");
        }
      }
    )
  }

  private getDelivedList(storeId: number, deliveryId: number): void {
    this.appState = DataState.LOADING_STATE;
    this.deliveredService.deliveredListForDelvery$(0, 100, storeId, deliveryId).subscribe(
      {
        next: (response) => {
          this.deliveredList = response.data.page.content;
          this.appState = DataState.LOADED_STATE;
        },
        error: (error) => {
          console.error(error);
          console.error("Cannot fetch product");
          this.appState = DataState.ERROR_STATE;
        }
      }
    )
  }

}
