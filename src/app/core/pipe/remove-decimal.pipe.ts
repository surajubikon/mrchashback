import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDecimal'
})
export class RemoveDecimalPipe implements PipeTransform {

  transform(value: number): number {
    return Math.trunc(value);
  }

}
