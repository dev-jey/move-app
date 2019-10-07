import { HttpParams } from '@angular/common/http';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).filter((key) => !!req[key]).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });
  }
  return options;
};
