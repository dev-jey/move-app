import { ActiveTimeDirective } from './active-time.directive';
import { ElementRef } from '@angular/core';
import { AuthService } from './auth/__services__/auth.service';

describe('ActiveTimeDirective', () => {
  it('should create the directive', async () => {
    const ele = document.createElement('div');
    const elementRef = new ElementRef(ele);
    const directive = new ActiveTimeDirective(elementRef);
    const time = Date.now();
    AuthService.lastActiveTime = time;
    const wait = () => new Promise(resolve => setTimeout(_ => resolve(true), 1000));
    await wait();
    directive.resetActiveTime();

    expect(AuthService.lastActiveTime).toBeGreaterThan(time);
  });

  it('should init', () => {
    const ele = document.createElement('div');
    jest.spyOn(ele, 'addEventListener');
    const elementRef = new ElementRef(ele);
    const directive = new ActiveTimeDirective(elementRef);

    directive.ngOnInit();
    expect(ele.addEventListener).toHaveBeenCalledTimes(3);
  });
});
