import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { FindDeliveryComponent } from './delivery/find-delivery/find-delivery.component';
import { AddDeliveryComponent } from './delivery/add-delivery/add-delivery.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DeliveryComponent } from './delivery/delivery/delivery.component';
import { DeliveryListComponent } from './delivery/delivery-list/delivery-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { ListStoreComponent } from './store/list-store/list-store.component';
import { AddStoreComponent } from './store/add-store/add-store.component';
import { SpinnerAdminComponent } from './spinners/spinner-admin/spinner-admin.component';
import { SchareModule } from '../schare/schare.module';
import { SaleListComponent } from './sale/sale-list/sale-list.component';
import { AddSaleComponent } from './sale/add-sale/add-sale.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { AddPurchaseComponent } from './purchase/add-purchase/add-purchase.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { InventoryDetailsComponent } from './inventory/inventory-details/inventory-details.component';
import { CustorOrderListComponent } from './customer-order/custor-order-list/custor-order-list.component';
import { CustorOrderDetailComponent } from './customer-order/custor-order-detail/custor-order-detail.component';
import { CustomerOrderReportComponent } from './daily-report/customer-order-report/customer-order-report.component';
import { SaleReportComponent } from './daily-report/sale-report/sale-report.component';
import { ReportsComponent } from './daily-report/reports/reports.component';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { UserManagerComponent } from './user/user-manager/user-manager.component';
import { PaymentListComponent } from './payment/payment-list/payment-list.component';
import { CommissionStoreComponent } from './commission-store/commission-store.component';
import { StoreProfileComponent } from './store/store-profile/store-profile.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AssignDeliveryOrderComponent } from './customer-order/assign-delivery-order/assign-delivery-order.component'; 
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    FindDeliveryComponent,
    AddDeliveryComponent,
    DeliveryComponent,
    DeliveryListComponent,
    UserListComponent,
    UserAddComponent,
    ListStoreComponent,
    AddStoreComponent,
    SpinnerAdminComponent,
    SaleListComponent,
    AddSaleComponent,
    ProductListComponent,
    AddProductComponent,
    PurchaseListComponent,
    AddPurchaseComponent,
    InventoryListComponent,
    InventoryDetailsComponent,
    CustorOrderListComponent,
    CustorOrderDetailComponent,
    CustomerOrderReportComponent,
    SaleReportComponent,
    ReportsComponent,
    UserManagerComponent,
    PaymentListComponent,
    CommissionStoreComponent,
    StoreProfileComponent,
    AssignDeliveryOrderComponent,
  ],
  imports: [
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    SchareModule,
    MatBadgeModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule,
    MatMenuModule,
    CommonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
     IonicModule.forRoot(),
  ],
  providers: [DatePipe],
})
export class AdminModule { }
