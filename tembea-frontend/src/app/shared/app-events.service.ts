import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { filter, share } from 'rxjs/operators';

export interface IEventData {
  name: string;
  content?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AppEventService {
  observable: Observable<any>;
  observer: Observer<any>;

  constructor() {
    this.observable = Observable.create((observer: Observer<any>) => {
      this.observer = observer;
    }).pipe(share());
  }

  broadcast(event: IEventData) {
    if (this.observer != null) {
      this.observer.next(event);
    }
  }

  subscribe(eventName, callback: (event: IEventData) => void): Subscription {
    return this.observable
      .pipe(
        filter(event => {
          return event.name === eventName;
        })
      )
      .subscribe(callback);
  }
}



