import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customTitlecase'
})
export class CustomTitlecasePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value || typeof value !== 'string') { return value; }

    const first = value.trim().charAt(0).toUpperCase();
    return `${first}${value.slice(1)}`;
  }

}
