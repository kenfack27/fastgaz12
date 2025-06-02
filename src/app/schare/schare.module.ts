import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from './custom-currency.pipe';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { GlobalSpinnerComponent } from './global-spinner/global-spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner/spinner.component'; 



@NgModule({
  declarations: [
    CustomCurrencyPipe,
    FooterComponent,
    GlobalSpinnerComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule

  ],
  exports: [CustomCurrencyPipe, FooterComponent,GlobalSpinnerComponent]
})
export class SchareModule { }
