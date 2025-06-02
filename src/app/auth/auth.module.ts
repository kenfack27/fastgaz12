import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivationAccountComponent } from './activation-account/activation-account.component';
import { CodeInputModule } from 'angular-code-input';
import { BasicRegisterComponent } from './basic-register/basic-register.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SchareModule } from '../schare/schare.module';
import { UpdatePasswordComponent } from './update-password/update-password.component';



@NgModule({
  declarations: [
    
    LoginComponent,
    RegisterComponent,
    ActivationAccountComponent,
    BasicRegisterComponent,
    ForgetPasswordComponent,
    UpdatePasswordComponent
  ],
  imports: [
    SchareModule,
    MatDialogModule,
    CodeInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
