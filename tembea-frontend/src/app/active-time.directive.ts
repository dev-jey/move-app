import { Directive, OnInit, ElementRef } from '@angular/core';
import { AuthService } from './auth/__services__/auth.service';

@Directive({
  selector: '[appActiveTime]'
})
export class ActiveTimeDirective implements OnInit {
  private el: HTMLElement;

  constructor(
    elRef: ElementRef
  ) {
    this.el = elRef.nativeElement;
  }

  ngOnInit(): void {
    this.el.addEventListener('mousemove', this.resetActiveTime);
    this.el.addEventListener('scroll', this.resetActiveTime);
    this.el.addEventListener('keydown', this.resetActiveTime);
  }

  resetActiveTime() {
    AuthService.lastActiveTime = Date.now();
  }
}
