import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortenText' })
export class ShortenTextPipe implements PipeTransform {

  transform(value: string, maxAllowedChars = 20): string {
    return value.length > maxAllowedChars
      ? `${value.slice(0, maxAllowedChars)}...`
      : value;
  }
}
