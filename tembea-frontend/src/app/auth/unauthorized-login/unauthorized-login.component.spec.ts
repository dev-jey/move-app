import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedLoginComponent } from './unauthorized-login.component';

describe('UnauthorizedLoginComponent', () => {
  let component: UnauthorizedLoginComponent;
  let fixture: ComponentFixture<UnauthorizedLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthorizedLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain h1', () => {
    const compiled = fixture.debugElement.nativeElement;
    const h1 = compiled.querySelector('h1');
    expect(h1.textContent).toEqual('Hi There!');
  });

  it('should contain p', () => {
    const compiled = fixture.debugElement.nativeElement;
    const p = compiled.querySelector('p');
    expect(p.textContent).toEqual('Sorry, you\'re not authorized to Login to Tembea :(');
  });
});
