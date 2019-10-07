import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { MediaObserver } from '@angular/flex-layout';
import { of } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA, Component, OnInit, OnDestroy } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { NavMenuService } from '../__services__/nav-menu.service';
import {CookieService} from '../../auth/__services__/ngx-cookie-service.service';
import {ClockService} from '../../auth/__services__/clock.service';
import { toastrMock } from '../routes/__mocks__/create-route';
import { AlertService } from '../../shared/alert.service';
import { HeaderComponent } from '../header/header.component';
import { AppEventService } from 'src/app/shared/app-events.service';

const sideNavMock = new NavMenuService();


const appEventsMock = {
  broadcast: jest.fn()
};

describe('SideBarComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  const routerMock = {
    events: of(new NavigationEnd(0, '/', null))
  };
  let router: Router;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: '', component: AdminComponent },
          { path: 'admin/trips/pending', component: AdminComponent },
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: RouterModule, useValue: routerMock },
        { provide: NavMenuService, useValue: sideNavMock}
      ]
    });

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  }));

  beforeEach(() => {
    jest.setTimeout(10000);
  });

  it('should create sideNav Component', () => {
    expect(component).toBeTruthy();
  });

  it('should click menu and open trips request', async () => {
    const prop = fixture.debugElement.query(By.css('#trips a'));

    jest.spyOn(component, 'menuClicked');

    prop.triggerEventHandler('click', {});

    expect(component.menuClicked).toHaveBeenCalledTimes(1);
  });

  describe('menuClicked on a large screen device', () => {
    it('should not call sideNav.close when clicked', () => {
      // test
      jest.spyOn(sideNavMock, 'close');
      component.menuClicked(true);
      // assert
      expect(sideNavMock.close).toBeCalledTimes(0);
    });
  });

  describe('ngOnInit', () => {
    it('should call addSubscriber' , () => {
      jest.spyOn(sideNavMock, 'addSubscriber');
      component.ngOnInit();
      sideNavMock.showProgress();
      expect(sideNavMock.addSubscriber).toHaveBeenCalled();
    });
    it('should set loading to true' , () => {
      jest.spyOn(sideNavMock, 'addSubscriber');
      component.ngOnInit();
      sideNavMock.showProgress();
      expect(component.loading).toBeTruthy();
    });
    it('should set loading to false' , () => {
      jest.spyOn(sideNavMock, 'addSubscriber');
      component.ngOnInit();
      sideNavMock.stopProgress();
      expect(component.loading).toBeFalsy();
    });
  });

  describe('activeRoute', () => {
    it('should change active route', async () => {
      await fixture.ngZone.run(async () => {
        expect(component.activeRoute).toEqual('');

        await router.navigate(['admin/trips/pending']);
        expect(component.activeRoute).toContain('trips/pending');
      });
    });
  });
});

describe('SideBarComponent on small devices', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(() => {
    // create mock
    const mediaObserverMock = {
      media$: of({ mqAlias: 'xs', mediaQuery: '' })
    };

    // setup component
    TestBed.configureTestingModule({
      declarations: [AdminComponent, HeaderComponent],
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        RouterTestingModule],
      providers: [
        CookieService,
        ClockService,
        { provide: AlertService, useValue: toastrMock },
        { provide: MediaObserver, useValue: mediaObserverMock },
        { provide: NavMenuService, useValue: sideNavMock },
        { provide: AppEventService, useValue: appEventsMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });
  it('should change menu orientation if screen size is small', () => {
    // assert
    expect(component.position).toEqual('side');
  });

  describe('logout model on small screen devices', () => {
    it('should call header.showLogoutModal', () => {
      jest.spyOn(component.header, 'showLogoutModal');
      component.responsiveLogout();
      expect(appEventsMock.broadcast).toHaveBeenCalledWith({
        name: 'SHOW_LOGOUT_MODAL'
      });
    });
  });

  describe('menuClicked on a small screen device', () => {
    it('should call sideNav.close when clicked', () => {

      component.position = 'over';
      component.menuClicked(true);

      expect(component.sidenav.opened).toBeFalsy();
    });
  });
});
