import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from './angular-material.module';
import {HttpClientModule} from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { AlertService } from './shared/alert.service';
import { Observable } from 'rxjs';

describe('AppComponent', () => {
  let fixture;
  let component;
  beforeEach(async(() => {
    const mockMatDialog = {
      open: () => {}
    };
    const alertMockData = {
      error: jest.fn(),
      success: jest.fn()
    };
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        HomeComponent
      ],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: AlertService, useValue: alertMockData }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to offline event on ngOnInit', () => {
    const subscribeSpy = jest.spyOn(Observable.prototype, 'subscribe');

    component.ngOnInit();

    expect(subscribeSpy).toBeCalledTimes(1);
  });

  it('should unsubscribe to offline event on ngOnDestroy', () => {
    component.offlineSubscription = {
      unsubscribe: jest.fn()
    };

    component.ngOnDestroy();

    expect(component.offlineSubscription.unsubscribe).toBeCalledTimes(1);
  });
});
