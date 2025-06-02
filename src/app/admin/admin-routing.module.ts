import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FindDeliveryComponent } from './delivery/find-delivery/find-delivery.component';
import { DeliveryComponent } from './delivery/delivery/delivery.component';
import { AddDeliveryComponent } from './delivery/add-delivery/add-delivery.component';
import { DeliveryListComponent } from './delivery/delivery-list/delivery-list.component';
import { HelpComponent } from '../web-site/help/help.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { ListStoreComponent } from './store/list-store/list-store.component';
import { AddStoreComponent } from './store/add-store/add-store.component';
import { authGuard } from '../auth/auth.guard';
import { SaleListComponent } from './sale/sale-list/sale-list.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { AddSaleComponent } from './sale/add-sale/add-sale.component';
import { SaleDetailsComponent } from './sale/sale-details/sale-details.component';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { AddPurchaseComponent } from './purchase/add-purchase/add-purchase.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { InventoryDetailsComponent } from './inventory/inventory-details/inventory-details.component';
import { CustorOrderListComponent } from './customer-order/custor-order-list/custor-order-list.component';
import { CustorOrderDetailComponent } from './customer-order/custor-order-detail/custor-order-detail.component';
import { CustomerOrderReportComponent } from './daily-report/customer-order-report/customer-order-report.component';
import { SaleReportComponent } from './daily-report/sale-report/sale-report.component';
import { ReportsComponent } from './daily-report/reports/reports.component';
import { UserManagerComponent } from './user/user-manager/user-manager.component';
import { PaymentListComponent } from './payment/payment-list/payment-list.component';
import { CommissionStoreComponent } from './commission-store/commission-store.component';
import { StoreProfileComponent } from './store/store-profile/store-profile.component';
import { AssignDeliveryOrderComponent } from './customer-order/assign-delivery-order/assign-delivery-order.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
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
          path: 'find-delivery',
          component: FindDeliveryComponent,
          title: 'find-delivery',
        },
        {
          path: "delivery/:lat/:lng",
          component: DeliveryComponent,
          canActivate: [authGuard],
          title: "delivery"
        },
        {
          path: 'add-delivery',
          component: AddDeliveryComponent,
          canActivate: [authGuard],
          title: "Add-delivery"
        },
        {
          path: 'delivery-list',
          component: DeliveryListComponent,
          canActivate: [authGuard],
          title: 'Delivery-List'
        },
        {
          component: UserListComponent,
          canActivate: [authGuard],
          path: 'users',
          title: 'Users'
        },
        {
          component: UserAddComponent,
          canActivate: [authGuard],
          path: 'add-user',
          title: 'Add-user'
        },
        {
          canActivate: [authGuard],
          component: UserManagerComponent,
          title: 'Manager user',
          path: 'user-manager/:id'
        },
        {
          component: ListStoreComponent,
          path: 'stores',
          canActivate: [authGuard],
          title: 'Store'
        },
        {
          component: AddStoreComponent,
          path: 'add-store',
          canActivate: [authGuard],
          title: 'Add-store'
        },
        {
          component: AddSaleComponent,
          path: 'add-sale',
          canActivate: [authGuard],
          title: 'sale-new-item'
        },
        {
          path: 'sale',
          component: SaleListComponent,
          canActivate: [authGuard],
          title: 'Sale'
        },
        {
          path: "sale/:id",
          component: SaleDetailsComponent,
          canActivate: [authGuard],
          title: "Sale details"
        },
        {
          path: 'products',
          component: ProductListComponent,
          title: 'Product'
        },
        {
          path: 'add-product',
          component: AddProductComponent,
          canActivate: [authGuard],
          title: 'Add product'
        },
        {
          path: 'purchases',
          component: PurchaseListComponent,
          title: 'Purchases'
        },
        {
          path: 'add-purchase',
          component: AddPurchaseComponent,
          canActivate: [authGuard],
          title: 'Purchase'
        },
        {
          canActivate: [authGuard],
          component: InventoryListComponent,
          title: 'history',
          path: 'inventory'
        },
        {
          canActivate: [authGuard],
          component: CustorOrderListComponent,
          title: 'customer-order',
          path: 'customer-order'
        },
        {
          path: "customer-order/:id",
          component: CustorOrderDetailComponent,
          canActivate: [authGuard],
          title: "customer-order-details"
        },
        {
          canActivate: [authGuard],
          component: InventoryDetailsComponent,
          title: 'Details',
          path: 'inventory-details/:id'
        },
        {
          canActivate: [authGuard],
          component: ReportsComponent,
          title: 'Daily-repport',
          path: 'daily-report'
        },
        {
          canActivate: [authGuard],
          component: CustomerOrderReportComponent,
          title: 'daily-repport',
          path: 'customer-order-daily-report'
        },
        {
          canActivate: [authGuard],
          component: SaleReportComponent,
          title: 'daily-repport',
          path: 'sale-daily-report'
        },
        {
          canActivate: [authGuard],
          component: PaymentListComponent,
          title: 'Payment List',
          path: 'store-payments'
        },
        {
          path: "commissions",
          canActivate: [authGuard],
          component: CommissionStoreComponent
        },
        {
          path: "store-profile",
          canActivate: [authGuard],
          component: StoreProfileComponent
        },
        {
          path: "assign-delivery/:id",
          component: AssignDeliveryOrderComponent,
          canActivate: [authGuard],
          title: "assign-delivery"
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
