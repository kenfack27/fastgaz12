import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {MatRadioModule} from '@angular/material/radio'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebSiteRoutingModule } from './web-site-routing.module';
import { StoreComponent } from './store/store.component';
import { WebSiteComponent } from './web-site.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { FindStoreComponent } from './find-store/find-store.component';
import { BottomSheetOverviewComponent } from './bottom-sheet-overview/bottom-sheet-overview.component';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MatMenuModule } from '@angular/material/menu';
import { HomePageComponent } from './home-page/home-page.component';
import { HelpComponent } from './help/help.component';
import {MatListModule} from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import { SchareModule } from '../schare/schare.module';
import { StoresComponent } from './stores/stores.component';
import { CoonectStoresComponent } from './coonect-stores/coonect-stores.component';
import {MatBadgeModule} from '@angular/material/badge'; 
import { MatDialogModule } from '@angular/material/dialog';
import { CustomerInvoiceComponent } from './customer-order-invoice/customer-invoice.component';
import { MyOrdersComponent } from './my-order/my-orders/my-orders.component';
import { OrderDetailsComponent } from './my-order/order-details/order-details.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';



@NgModule({

  declarations: [
    
    StoreComponent,
    WebSiteComponent,
    FindStoreComponent,
    BottomSheetOverviewComponent,
    BottomSheetComponent,
    OrderItemComponent,
    CheckoutComponent,
    HomePageComponent,
    HelpComponent,
    StoresComponent,
    CoonectStoresComponent,
    CustomerInvoiceComponent,
    MyOrdersComponent,
    OrderDetailsComponent,
    UserProfileComponent,
  ],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatRadioModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    SchareModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatBottomSheetModule,
    GoogleMapsModule,
    CommonModule,
    WebSiteRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ]
})
export class WebSiteModule { }
