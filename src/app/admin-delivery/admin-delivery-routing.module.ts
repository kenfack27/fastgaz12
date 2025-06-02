import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDeliveryComponent } from './admin-delivery.component';
import { ReceiveOrderComponent } from './receive-order/receive-order.component';
import { ScanOrderComponent } from './scan-order/scan-order.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDeliveryComponent } from './add-delivery/add-delivery.component';
import { authGuard } from '../auth/auth.guard';
import { OrderDetailsComponent } from './receive-order/order-details/order-details.component';
import { CommissionDeliveryComponent } from './commission-delivery/commission-delivery.component';
import { TransactionHistory } from '../model/transaction-history';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';


const routes: Routes = [
  {
    path: 'delivery',
    component: AdminDeliveryComponent,
    canActivate: [authGuard],
    children:
      [
        {
          path: '',
          component: DashboardComponent,
          canActivate: [authGuard],
        },
        {
          path: 'orders',
          component: ReceiveOrderComponent,
          title: 'Orders',
          canActivate: [authGuard],
        },

        {
          path: 'orders/:id',
          component: OrderDetailsComponent,
          title: 'Orders',
          canActivate: [authGuard],
        },
        {
          path: 'becomme-delivery',
          component: AddDeliveryComponent,
          title: 'becomme-delivery',
          canActivate: [authGuard],
        },
        {
          path: 'scanner',
          component: ScanOrderComponent,
          title: 'Scanner',
          canActivate: [authGuard],
        },
        {
          path: "commissions",
          canActivate: [authGuard],
          component: CommissionDeliveryComponent
        },
        {
          path: "transaction-history",
          canActivate: [authGuard],
          component: TransactionHistoryComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDeliveryRoutingModule { }
