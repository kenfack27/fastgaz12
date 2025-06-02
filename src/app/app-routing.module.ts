import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PaymentMTNComponent } from './payment/payment-mtn/payment-mtn.component';
import { authGuard } from './auth/auth.guard';
import { WithdrawalComponent } from './payment/withdrawal/withdrawal.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/welcom",
    pathMatch: 'full'
  },
  {
    path: "welcom",
    component: WelcomeComponent
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
    title: 'page-not-found'
  },
  {
    path: 'payment-mtn',
    component: PaymentMTNComponent,
    title: 'payment-mtn'
  },
  {
    path: 'payment-mtn/:id',
    component: PaymentMTNComponent,
    title: 'payment-mtn'
  },
  {
    canActivate: [authGuard],
    component: WithdrawalComponent,
    title: 'withdrawal',
    path: 'withdrawal'
  },
  {
    path: '**',
    redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
