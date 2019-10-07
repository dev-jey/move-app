import { InjectionToken } from '@angular/core';

export let TOASTR_TOKEN = new InjectionToken<Toastr>('toastr');
export interface Toastr {
  success(msg: string, title?: string, options?: object): void;
  info(msg: string, title?: string, options?: object);
  warning(msg: string, title?: string, options?: object): void;
  error(msg: string, title?: string, options?: object): void;
  clear(toastr: any): void;
}
