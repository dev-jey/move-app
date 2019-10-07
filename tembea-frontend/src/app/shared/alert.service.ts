import { Injectable, Inject } from '@angular/core';
import { TOASTR_TOKEN, Toastr } from 'src/app/shared/toastr.service';

@Injectable()
export class AlertService {
  constructor(@Inject(TOASTR_TOKEN) private toastr: Toastr) { }
  options: object = {
    positionClass: 'toast-top-center',
    preventDuplicates: true
  };
  success(msg: string, title?: string) {
     this.toastr.success(msg, title, this.options);
  }
  info(msg: string, title?: string) {
    return this.toastr.info(msg, title, this.options);
  }
  warning(msg: string, title?: string) {
    this.toastr.warning(msg, title, this.options);
  }
  error(msg: string, title?: string) {
    this.toastr.error(msg, title, this.options);
  }
  clear(toastr: Toastr) {
    this.toastr.clear(toastr);
  }
}
