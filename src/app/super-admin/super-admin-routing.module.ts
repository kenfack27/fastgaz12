import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';
import { authGuard } from '../auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreListComponent } from './store/store-list/store-list.component';
import { StoreDetailsComponent } from './store/store-details/store-details.component';
import { CommissionSystemComponent } from './commission-system/commission-system.component';
import { ConfigurationDetailsComponent } from './configuation/configuration-details/configuration-details.component';
import { CustomerOrderDetailComponent } from './customer-order-detail/customer-order-detail.component';

const routes: Routes = [

  {
    path: 'management',
    component: SuperAdminComponent,
    canActivate: [authGuard],
    children:
      [
        {
          path: '',
          component: DashboardComponent,
          canActivate: [authGuard],
          title: 'dashboard',
        },
        {
          path: "stores",
          canActivate: [authGuard],
          component: StoreListComponent
        },
        {
          path: "stores/:id",
          canActivate: [authGuard],
          component: StoreDetailsComponent
        },
        {
          path: "commissions",
          canActivate: [authGuard],
          component: CommissionSystemComponent
        },
        {
          path: "congiguration",
          canActivate: [authGuard],
          component: ConfigurationDetailsComponent
        },
        {
          path: "order-status/:orderStatus",
          canActivate: [authGuard],
          component: CustomerOrderDetailComponent
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
