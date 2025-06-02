import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CustomerOrderSumary } from 'src/app/model/utils/customer-order-sumary';
import { DataState } from 'src/app/model/utils/data-state';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { NotificationService } from 'src/app/service/notification.service';
import { StoreService } from 'src/app/service/storeService.service';

import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';


@Component({
  selector: 'app-customer-order-report',
  templateUrl: './customer-order-report.component.html',
  styleUrls: ['./customer-order-report.component.css']
})
export class CustomerOrderReportComponent implements OnInit {

  datePickerFrom = this.fb.group({
    releasedAt: []
  });

  appState: DataState = DataState.LOADING_STATE;
  appState2: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  storeID: any;
  newStoreId:any;
  customerOrderSumary: CustomerOrderSumary[] = [];
  customerOrderSumaryWithPackaging: CustomerOrderSumary[] = [];

  // 2024-12-11
  day: string = "";
  year: string = "";
  month: string = "";
  createdDate: any = "2024-12-11";

  constructor(private location: Location, private router: Router, private storeService: StoreService,private datePipe: DatePipe,
    private notifier: NotificationService, private customerOrderSecureService: CustomerOrderSecureService, private fb: FormBuilder
  ) { 
    this.createdDate = this.datePipe.transform( new Date(),'yyyy-MM-dd');
  }


  ngOnInit(): void {
    this.storeID = this.storeService.getStoreID();
    this.getStoreByUUID(this.storeID);
    console.log(this.createdDate)
  }

  onDonloadReport() {

  }

  // Handle date change event 
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) { 
      this.createdDate = 
      this.datePipe.transform(event.value, 'yyyy-MM-dd'); 
      console.log('Date Changed:', this.createdDate); 
      this.getCustomerOrderReportByStore(this.newStoreId, this.createdDate);
      this.getCustomerOrderReportByStoreWithPackaging(this.newStoreId, this.createdDate);
    }
  }

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.newStoreId = response.data.store.id;
        this.getCustomerOrderReportByStore(response.data.store.id, this.createdDate);
        this.getCustomerOrderReportByStoreWithPackaging(response.data.store.id, this.createdDate);
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        this.router.navigate((["/login"]));
        console.error(error);
      }
    });
  }

  private getCustomerOrderReportByStore(storeId: number, createdDate: any): void {
    this.appState = DataState.LOADING_STATE;
    this.customerOrderSecureService.getCustomerOrderSummaryByStoreAndDate$(storeId, createdDate).subscribe({
      next: (response => {
        this.customerOrderSumary = response.data.customerOrderSumary;
        this.notifier.onDefault(response.message);
        this.appState = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        if (error) {
          this.appState = DataState.ERROR_STATE
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }

  private getCustomerOrderReportByStoreWithPackaging(storeId: number, createdDate: any): void {
    this.appState2 = DataState.LOADING_STATE;
    this.customerOrderSecureService.getCustomerOrderSummaryWithPackagingByStoreAndDate$(storeId, createdDate).subscribe({
      next: (response => {
        this.customerOrderSumaryWithPackaging = response.data.customerOrderSumary;
        this.notifier.onDefault(response.message);
        this.appState2 = DataState.LOADED_STATE;
      }),
      error: (error) => {
        console.error(error);
        this.notifier.onError("Oups! something whent wrong !");
        if (error) {
          this.appState2 = DataState.ERROR_STATE
        }
      },
      complete: () => {
        this.appState = DataState.LOADED_STATE;
      }
    });
  }

  onGoBack() {
    this.location.back();
  }


  exportToPDF() {
    const content = document.getElementById('content-to-download');
    if (content) {
      html2canvas(content).then((canvas) => {
        const data = canvas.toDataURL();
        const documentDefinition = {
          content: [
            {
              image: data,
              width: 500
            }
          ]
        };
        pdfMake.createPdf(documentDefinition).download('report-' + new Date() + '.pdf');
      });
    }
  }

  exportToPDF2() {
    const content = document.getElementById('content-to-export-in-pdf');
    if (content) {
      html2canvas(content).then((canvas) => {
        const data = canvas.toDataURL();
        const documentDefinition = {
          content: [
            {
              image: data,
              width: 500
            }
          ]
        };
        pdfMake.createPdf(documentDefinition).download('report-' + new Date() + '.pdf');
      });
    }
  }

}
