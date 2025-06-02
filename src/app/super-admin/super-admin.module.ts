import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SchareModule } from '../schare/schare.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreListComponent } from './store/store-list/store-list.component';
import { StoreDetailsComponent } from './store/store-details/store-details.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CommissionSystemComponent } from './commission-system/commission-system.component'; 
import { MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { ConfigurationDetailsComponent } from './configuation/configuration-details/configuration-details.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CustomerOrderDetailComponent } from './customer-order-detail/customer-order-detail.component'; 



@NgModule({
  declarations: [
   
    DashboardComponent,
    StoreListComponent,
    StoreDetailsComponent,
    CommissionSystemComponent,
    ConfigurationDetailsComponent,
    CustomerOrderDetailComponent
  ],
  imports: [
    MatDatepickerModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    SuperAdminRoutingModule,
    SchareModule,
    MatBadgeModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

  ]
})
export class SuperAdminModule { }
