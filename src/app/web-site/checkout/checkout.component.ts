import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {



  constructor(private notifier: NotificationService, private location:Location) { }

  onConfirm() {
    this.notifier.onSuccess("Your order has bee send");
    this.notifier.onInfo("Stay connected")
    this.notifier.onInfo("You will receive  ");
    this.notifier.onInfo("A notication");
    this.notifier.onInfo("from Delivery soon");
  }

  onGoBack() {
    this.location.back();
  }
  goForward() {
    this.location.forward(); // Navigate forward to the next URL
  }

}
