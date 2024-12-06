import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'kConverter' })
export class KConverterPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 10000) {
      const suffixes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
      const exp = Math.floor(Math.log(value) / Math.log(1000));
      return (value / Math.pow(1000, exp)).toFixed(1) + suffixes[exp];
    }
    return value.toString();
  }
}
