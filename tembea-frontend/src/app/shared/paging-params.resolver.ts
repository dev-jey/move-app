import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PagingParamsResolver  implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let { page } = route.queryParams;
    page = page || 1;
    return {
      page: parseInt(page, 10),
    };
  }
}
