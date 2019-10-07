import { Pipe, PipeTransform } from '@angular/core';

export interface IShortenNameOption {
  max?: number;
  fallbackText?: string;
}

@Pipe({
  name: 'shortenName'
})
export class ShortenNamePipe implements PipeTransform {
  defaultOption: IShortenNameOption = {
    max: 8, fallbackText: 'NA'
  };

  transform(value: string, args?: IShortenNameOption): string {
    const { max, fallbackText } = { ...this.defaultOption, ...args };
    if (!value) {
      return fallbackText;
    }
    let maxTextLength = max;
    let result = value;
    if (value.indexOf(' ') > 0) {
      const regExp = /[\s]+/;
      const splitStr = value.replace(regExp, ' ').split(' ');
      const last = splitStr.pop();
      const initials = splitStr.map((item) => item.charAt(0).toUpperCase()).join('.');
      result = `${initials}.${last}`;
      maxTextLength += splitStr.length - 1;
    }
    const ellipse = result.length > maxTextLength;
    return `${result.substring(0, maxTextLength)}${(ellipse) ? '...' : ''}`;
  }

}
