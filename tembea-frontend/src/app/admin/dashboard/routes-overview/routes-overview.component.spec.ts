import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { RoutesOverviewComponent } from './routes-overview.component';

describe('RoutesOverviewComponent', () => {
  let component: RoutesOverviewComponent;
  let fixture: ComponentFixture<RoutesOverviewComponent>;
  const data = {
    Route: 'Nyika',
    RouteBatch: 'A',
    percentageUsage: 30
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesOverviewComponent ],
      imports: [AngularMaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesOverviewComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
