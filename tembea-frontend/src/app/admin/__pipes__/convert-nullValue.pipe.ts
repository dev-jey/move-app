import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertNullValue'
})
export class ConvertNullValue implements PipeTransform {

  transform(value: string, fallback = ''): string {
      if (value === null) {
        return fallback;
      }
      return value;
  }
}
