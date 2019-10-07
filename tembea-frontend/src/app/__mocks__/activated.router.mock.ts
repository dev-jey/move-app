import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

export class ActivatedRouteMock extends ActivatedRoute {
  constructor(parameters?: any) {
    super();
    this.queryParams = of(parameters);
    this.params = of(parameters);
    this.data = of({
      ...parameters,
      pagingParams: {
        page: 10,
      }
    });
  }
}
