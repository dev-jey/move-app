import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundComponent } from './page-not-found.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let notFoundPage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    notFoundPage = fixture.nativeElement;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have <h2> with "Error 404"', () => {
    const h2 = notFoundPage.querySelector('.page-title');
    expect(h2.textContent).toEqual('Error 404');
  });

  it('should contain <p> with more details', () => {
    const p = notFoundPage.querySelector('.details > p');
    expect(p.textContent).toEqual('The page you\'re looking for isn\'t here :(');
  });

  it('should contain link back to home', () => {
    const href = notFoundPage.querySelector('.header > a').getAttribute('href');
    expect(href).toEqual('/');
  });
});
