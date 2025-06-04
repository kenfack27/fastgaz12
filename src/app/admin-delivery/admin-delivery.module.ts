import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDeliveryRoutingModule } from './admin-delivery-routing.module';
import { AdminDeliveryComponent } from './admin-delivery.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ReceiveOrderComponent } from './receive-order/receive-order.component';
import { ScanOrderComponent } from './scan-order/scan-order.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SpinnerDeliveryComponent } from './spinner-delivery/spinner-delivery.component';
import { AddDeliveryComponent } from './add-delivery/add-delivery.component';
import {MatSelectModule} from '@angular/material/select'; 
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { SchareModule } from '../schare/schare.module';
import { OrderDetailsComponent } from './receive-order/order-details/order-details.component';
import { CommissionDeliveryComponent } from './commission-delivery/commission-delivery.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    AdminDeliveryComponent,
    ReceiveOrderComponent,
    ScanOrderComponent,
    DashboardComponent,
    SpinnerDeliveryComponent,
    AddDeliveryComponent,
    OrderDetailsComponent,
    CommissionDeliveryComponent,
    TransactionHistoryComponent,
  ],
  imports: [
    MatCheckboxModule,
    ZXingScannerModule,
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatTableModule,
    MatMenuModule,
    CommonModule,
    AdminDeliveryRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    SchareModule,
    MatSelectModule,
    IonicModule.forRoot(),

  ]
})
export class AdminDeliveryModule { 
  
}
