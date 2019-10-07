import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { AlertService } from './shared/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    div { height: 100%; width: 100% }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  offlineEvent: Observable<Event>;
  offlineSubscription: Subscription;

  constructor(
    private toastr: AlertService
  ) { }

  ngOnInit(): void {
    this.offlineEvent = fromEvent(window, 'offline');

    this.offlineSubscription = this.offlineEvent.subscribe(() => {
      this.toastr.error('You seem to be offline.');
    });
  }

  ngOnDestroy(): void {
    this.offlineSubscription.unsubscribe();
  }
}
