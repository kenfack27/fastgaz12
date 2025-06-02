import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { WebSiteComponent } from './web-site.component';
import { FindStoreComponent } from './find-store/find-store.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HelpComponent } from './help/help.component';
import { StoresComponent } from './stores/stores.component';
import { CustomerInvoiceComponent } from './customer-order-invoice/customer-invoice.component';
import { MyOrdersComponent } from './my-order/my-orders/my-orders.component';
import { authGuard } from '../auth/auth.guard';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { AboutComponent } from '../about/about.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';

const routes: Routes = [

  {
    path: 'service',
    component: WebSiteComponent,
    title: 'service',
    children: [
      {
        path: '',
        children: [

          {
            path: "stores",
            component: StoresComponent,
            title: "Stores"
          },
          {
            path: "store/:lat/:lng",
            component: StoreComponent,
            title: "store"
          },
          {
            path: "store/:id",
            component: StoreComponent,
            title: "store"
          },
          {
            path: "find-store",
            component: FindStoreComponent, title: "Find-store"
          },
          {
            path: "order-item",
            component: OrderItemComponent,
            title: "Order"
          },
          {
            path: '',
            component: HomePageComponent,
            title: 'Home-Page'
          },
          {
            path: "checkout",
            component: CheckoutComponent,
            title: "Checkout"
          },
          {
            path: "customer-invoice/:id",
            component: CustomerInvoiceComponent,
            title: "customer-invoice"
          },
          {
            path: 'my-order',
            title: 'my-order',
            canActivate:[authGuard],
            component: MyOrdersComponent
          },
          {
            path: 'profile',
            title: 'profile',
            canActivate:[authGuard],
            component: UserProfileComponent
          },
          {
            path: 'help',
            component: HelpComponent,
            title: 'Help'
          },
          {
            path: 'about',
            component: AboutComponent,
            title: 'About this application'
          },
          {
            path: 'contact',
            component: ContactUsComponent,
            title: 'Contact Us Component',
          }
        ]
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSiteRoutingModule { }
