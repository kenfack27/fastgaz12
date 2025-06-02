import { Pipe, PipeTransform } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
@Pipe({ name: 'localCurrency' })
export class CustomPipe implements PipeTransform {
  transform(
    value: any,
    currencyCode: string = 'XAF',
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo: string = '1.2-2',
    locale: string = 'en-US'
  ): string | null {
    const localCurrency = new CurrencyPipe(locale);
    return localCurrency.transform(value, currencyCode, display, digitsInfo);
  }
}