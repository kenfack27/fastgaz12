import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { DataState } from 'src/app/model/utils/data-state';
import { SaleSumary } from 'src/app/model/utils/sale-sumary';
import { CustomerOrderSecureService } from 'src/app/service/customer-order-secure.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SaleService } from 'src/app/service/sale.service';
import { StoreService } from 'src/app/service/storeService.service';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.css']
})
export class SaleReportComponent implements OnInit {

  datePickerFrom = this.fb.group({
    releasedAt: []
  })

  appState: DataState = DataState.LOADING_STATE;
  appState2: DataState = DataState.LOADING_STATE;
  readonly DataState = DataState;
  storeID: any;
  newStoreId: any;
  saleSumary: SaleSumary[] = [];
  saleSumaryWithPackaging: SaleSumary[] = [];

  // 2024-12-11
  day: string = "";
  year: string = "";
  month: string = "";
  createdDate: any = "2024-12-11";

  constructor(
    private location: Location, private router: Router, private storeService: StoreService, private datePipe: DatePipe,
    private notifier: NotificationService, private customerOrderSecureService: CustomerOrderSecureService,
    private fb: FormBuilder,
    private saleService:SaleService
  ) {
    this.createdDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
      this.getSaleReportByStore(this.newStoreId, this.createdDate);
      this.getSaleReportByStoreWithPackaging(this.newStoreId, this.createdDate);
    }
  }

  private getStoreByUUID(uuid: string): void {
    this.storeService.storeUUID$(this.storeID).subscribe({
      next: (response) => {
        this.newStoreId = response.data.store.id;
        this.getSaleReportByStore(response.data.store.id, this.createdDate);
        this.getSaleReportByStoreWithPackaging(response.data.store.id, this.createdDate);
      },
      error: (error) => {
        this.notifier.onError('Not store found. Login again');
        this.router.navigate((["/login"]));
        console.error(error);
      }
    });
  }

  private getSaleReportByStore(storeId: number, createdDate: any): void {
    this.appState = DataState.LOADING_STATE;
    this.saleService.getSaleByStoreAndDate$(storeId, createdDate).subscribe({
      next: (response => {
        this.saleSumary = response.data.saleSumary;
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

  private getSaleReportByStoreWithPackaging(storeId: number, createdDate: any): void {
    this.appState2 = DataState.LOADING_STATE;
    this.saleService.getSaleWithPackagingByStoreAndDate$(storeId, createdDate).subscribe({
      next: (response => {
        this.saleSumaryWithPackaging = response.data.saleSumary;
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

}
