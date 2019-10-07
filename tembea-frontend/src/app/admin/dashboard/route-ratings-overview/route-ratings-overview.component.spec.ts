import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteRatingsOverviewComponent } from './route-ratings-overview.component';
import { mockRouteRatings } from './ratingsMockData';


describe('RouteRatingsOverviewComponent', () => {
  let component: RouteRatingsOverviewComponent;
  let fixture: ComponentFixture<RouteRatingsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteRatingsOverviewComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteRatingsOverviewComponent);
    component = fixture.componentInstance;
    component.ratings = mockRouteRatings;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
