import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(
    value: any,
    currencyCode: string = 'XAF',
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo: string = '1.2-2',
    locale: string = 'en-US'
  ): string | null {
    const customCurrency = new CurrencyPipe(locale);
    return customCurrency.transform(value, currencyCode, display, digitsInfo);
  }
}