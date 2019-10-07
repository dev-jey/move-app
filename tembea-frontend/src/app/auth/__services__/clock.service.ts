import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ClockService {
  private clock: Observable<number>;

  constructor() {
    // This clock will emit every 20 seconds.
    this.clock = interval(20000);
  }

  getClock(): Observable<number> {
    return this.clock.pipe(
      map(() => Date.now())
    );
  }
}
