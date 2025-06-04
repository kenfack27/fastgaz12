import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';

import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { WebSiteModule } from './web-site/web-site.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CustomPipe } from './custorm.pipe';
import { AdminModule } from './admin/admin.module';
import { FooterComponent } from './footer/footer.component';
import { AuthModule } from './auth/auth.module';
import { AdminDeliveryModule } from './admin-delivery/admin-delivery.module';
import { TokenInterceptor } from './interceptors/token-interceptor.service';
import { JwtModule } from '@auth0/angular-jwt';
import { MessageComponent } from './alert/message/message.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageModaleComponent } from './alert/message-modale/message-modale.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { PaymentMTNComponent } from './payment/payment-mtn/payment-mtn.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WithdrawalComponent } from './payment/withdrawal/withdrawal.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { StatusBarHandlerComponent } from './shared/status-bar-handler/status-bar-handler.component';




export function tokenGetter() {
  return localStorage.getItem("FAST__GAZ_API_TOKEN");
}

@NgModule({
  declarations: [
    CustomPipe,
    WelcomeComponent,
    PageNotFoundComponent,
    FooterComponent,
    MessageComponent,
    AppComponent,
    MessageModaleComponent,
    SuperAdminComponent,
    PaymentMTNComponent,
    WithdrawalComponent,
    AboutComponent,
    ContactUsComponent,
    StatusBarHandlerComponent
  ],
  imports: [
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatButtonModule,
    GoogleMapsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    AdminDeliveryModule,
    SuperAdminModule,
    AdminModule,
    WebSiteModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    JwtModule.forRoot({
        config: {
            tokenGetter: tokenGetter,
            allowedDomains: [
                "http://localhost:8087/api/v1/fast-gaz", "http://localhost:8087/logout",
                "http://195.231.19.75:8087/api/v1/fast-gaz", "http://195.231.19.75:8086/logout",
                "https://kapexpert.cloud:8087/api/v1/fast-gaz", "https://kapexpert.cloud:8087/logout"
            ]
        }
    }),
    NotifierModule.withConfig({
        position: {
            horizontal: {
                position: 'left',
                distance: 12,
            },
            vertical: {
                position: 'bottom',
                distance: 12,
                gap: 10,
            },
        },
        theme: 'material',
        behaviour: {
            autoHide: 5000,
            onClick: false,
            onMouseover: 'pauseAutoHide',
            showDismissButton: true,
            stacking: 4,
        },
        animations: {
            enabled: true,
            show: {
                preset: 'slide',
                speed: 300,
                easing: 'ease',
            },
            hide: {
                preset: 'fade',
                speed: 300,
                easing: 'ease',
                offset: 50,
            },
            shift: {
                speed: 300,
                easing: 'ease',
            },
            overlap: 150,
        },
    }),
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    IonicModule.forRoot({}),
],
  providers: [
    CustomPipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
