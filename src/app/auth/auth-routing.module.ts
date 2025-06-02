import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ActivationAccountComponent } from './activation-account/activation-account.component';
import { BasicRegisterComponent } from './basic-register/basic-register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent,
    title: 'Singin'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register'
  },
  {
    path: 'register-basic',
    component: BasicRegisterComponent,
    title: 'Register'
  },
  {
    path: 'activation-account',
    component: ActivationAccountComponent,
    title: 'Activation-account'
  },
  {
    component: ForgetPasswordComponent,
    path: 'forgot-password',
    title: 'Forgot-password'
  },
  {
    path: 'change-password',
    title: 'change-password',
    component: UpdatePasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
