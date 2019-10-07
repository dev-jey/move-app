import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService {

  private progressListener = new Subject();

  private sidenav: MatSidenav;

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public showProgress() {
   return this.progressListener.next(true);
  }

  public stopProgress() {
    return this.progressListener.next(false);
  }

  public open() {
    return this.sidenav.open();
  }

  public close() {
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }

  public addSubscriber(subscriber) {
    return this.progressListener.subscribe(subscriber);
  }
}
