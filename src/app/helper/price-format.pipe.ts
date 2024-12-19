import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone:true
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'AED'): string {
    if (value >= 1000 && value < 1000000) {
      return `${currency} ${(value / 1000).toFixed(1)} Thousand`;
    } else if (value >= 1000000 && value < 1000000000) {
      return `${currency} ${(value / 1000000).toFixed(1)} Million`;
    } else if (value >= 1000000000) {
      return `${currency} ${(value / 1000000000).toFixed(1)} Billion`;
    }
    return `${currency} ${value.toLocaleString()}`;
  }
}
