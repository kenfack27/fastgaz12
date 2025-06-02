import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {



  constructor(private location: Location, private router: Router) { }

  onGoBack() {
    this.location.back();
  }

  onGoToCustomerOderReport() {
    this.router.navigate(["/admin/customer-order-daily-report"]);
  }

  onGoToSaleReport() {
    this.router.navigate(["/admin/sale-daily-report"]);
  }

}
