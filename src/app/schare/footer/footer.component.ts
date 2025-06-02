import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  currentRoute: string = '';
  cartItemCount: number = 0;
  constructor(private router:Router){}

 

  onCheckout() {
    console.log("click")
    this.router.navigate(["/service/order-item"])
  }


   onGoHome():void{
    this.router.navigate(["/welcom/"])
  }


  
  onOpenHelp(): void {
    this.router.navigate(['/service/help']);
  }

}
