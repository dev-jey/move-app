import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutesInventoryComponent } from './routes-inventory.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { CreateRouteHelper } from '../create-route/create-route.helper';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import getRoutesResponseMock from './__mocks__/get-routes-response.mock';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { routesMock } from './__mocks__/route-inventory.mock';
import { AlertService } from '../../../shared/alert.service';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { ExportComponent } from '../../export-component/export.component';
import { SearchService } from '../../__services__/search.service';
import { CookieService } from '../../../auth/__services__/ngx-cookie-service.service';
import { mockCookieService } from '../../../shared/__mocks__/mockData';
import { ClockService } from '../../../auth/__services__/clock.service';
import { AppEventService } from '../../../shared/app-events.service';

describe('RoutesInventoryComponent', () => {
  let component: RoutesInventoryComponent;
  let fixture: ComponentFixture<RoutesInventoryComponent>;
  const routeObject = {
    id: 1,
    destination: 'EPIC Tower',
    capacity: 1,
    name: 'Yaba',
    regNumber: 'JKD 839',
    takeOff: '12:00'
  };

  const createRouteHelperMock = {
    notifyUser: jest.fn()
  };

  const routesInventoryMock = {
    createRoute: jest.fn().mockResolvedValue({ message: 'Successfully created' }),
    getRoutes: () => of(getRoutesResponseMock),
    changeRouteStatus: jest.fn().mockReturnValue(of({})),
    deleteRouteBatch: jest.fn().mockReturnValue(of({
      success: true,
      message: 'batch deleted successfully'
    }))
  };

  const searchServiceMock = {
    searchData: () => of(getRoutesResponseMock),
    searchItems: jest.fn().mockReturnValue(of(getRoutesResponseMock)),
  };

  const clockServiceMock = {
    getClock: jest.fn().mockReturnValue(of(6000000000)),
  };

  const router = {
    navigate: jest.fn(),
    events: of({})
  };

  const alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };

  const mockMatDialogRef = {
    close: () => {
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        RoutesInventoryComponent,
        EmptyPageComponent,
        ConfirmModalComponent,
        AppPaginationComponent,
        ExportComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: AlertService, useValue: alert },
        { provide: CreateRouteHelper, useValue: createRouteHelperMock },
        { provide: RoutesInventoryService, useValue: routesInventoryMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: CookieService, useValue: mockCookieService },
        { provide: ClockService, useValue: clockServiceMock },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            data: {
              displayText: 'display data',
              confirmText: 'yes'
            }
          }
        },
        { provide: Router, useValue: router },
      ],
      imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ConfirmModalComponent]
        }
      }).compileComponents();

    fixture = TestBed.createComponent(RoutesInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.spyOn(routesInventoryMock, 'getRoutes');
    jest.spyOn(searchServiceMock, 'searchData');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create RouteInventoryComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should create component and render routes', async(() => {
    component.getRoutesInventory();
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('.actions-icon'));

    expect(button.length).toEqual(1);
    expect(component.isLoading).toBe(false);
  }));

  it('should call getRoutes and return list of routes', async(() => {
    component.getRoutesInventory();
    fixture.detectChanges();

    expect(component.routes).toEqual(getRoutesResponseMock.routes);

    const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
    expect(button.length).toEqual(2);
  }));


  describe('ngOnInit', () => {
    it('should update and load page', (() => {
      jest.spyOn(component, 'getRoutesInventory');

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.routes).toEqual(getRoutesResponseMock.routes);
      expect(component.getRoutesInventory).toHaveBeenCalled();
    }));
  });

  describe('setPage', () => {
    it('should update and load page', (() => {
      jest.spyOn(component, 'getRoutesInventory');

      expect(component.pageNo).toEqual(1);

      component.setPage(20);
      fixture.detectChanges();
      expect(component.pageNo).toEqual(20);
      expect(component.getRoutesInventory).toHaveBeenCalled();
    }));
  });

  describe('showCopyConfirmModal', () => {
    it('should open copy modal when copy icon is clicked', () => {
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
      component.getRoutesInventory();
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('.duplicate-icon'));
      buttons[0].triggerEventHandler('click', null);

      expect(dialogSpy).toBeCalledTimes(1);
    });
  });

  describe('Copy Route', () => {
    it('should duplicate a route when copy is successful', () => {
      const sendRequestToServer = jest.spyOn(component, 'sendRequestToServer');

      component.copyRoute(routeObject);

      expect(sendRequestToServer).toHaveBeenCalledWith(routeObject.id);
    });
  });

  describe('Send Request to Server', () => {
    beforeEach(() => {
      jest.spyOn(routesInventoryMock, 'createRoute').mockResolvedValue({ message: 'Successfully duplicated Yaba route' });
    });
    it('should display a success message if copy request is successful', async () => {
      await component.sendRequestToServer(routeObject.id);

      expect(routesInventoryMock.createRoute).toHaveBeenCalledWith(routeObject.id, true);
      expect(createRouteHelperMock.notifyUser).toHaveBeenCalledWith(['Successfully duplicated Yaba route'], 'success');
      expect(router.navigate).toHaveBeenCalledWith(['/admin/routes/inventory']);
    });

    it('should display an error message if request is unsuccessful', async () => {
      const response = { error: { message: 'some server error' } };
      jest.spyOn(routesInventoryMock, 'createRoute')
        .mockRejectedValue(response);

      await component.sendRequestToServer(routeObject.id);

      expect(routesInventoryMock.createRoute).toHaveBeenCalledWith(routeObject.id, true);
      expect(createRouteHelperMock.notifyUser).toHaveBeenCalledWith([response.error.message]);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Change Route Status', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call the method to update routes data', () => {
      jest.spyOn(routesInventoryMock, 'changeRouteStatus').mockReturnValue(of({ success: true }));
      jest.spyOn(component, 'updateRoutesData').mockImplementation();

      component.changeRouteStatus(1, 'Active');
      expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledTimes(1);
      expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
      expect(component.updateRoutesData).toHaveBeenCalledTimes(1);
      expect(component.updateRoutesData).toHaveBeenCalledWith(1, 'Active');
    });

    it('should call the method to update routes data and catch all errors', () => {
      jest.spyOn(component, 'updateRoutesData').mockImplementation();
      jest.spyOn(routesInventoryMock, 'changeRouteStatus').mockReturnValue(throwError(new Error()));

      component.changeRouteStatus(1, 'Active');
      expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledTimes(1);
      expect(routesInventoryMock.changeRouteStatus).toHaveBeenCalledWith(1, { status: 'Active' });
      expect(alert.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('update routes data', () => {
    it('should return the updated routes ', () => {
      component.routes = routesMock;

      component.updateRoutesData(1, 'Active');
      expect(component.routes).not.toEqual(routesMock);
      expect(component.routes[0].status).toEqual('Active');
    });
  });

  describe('showDeleteModal', () => {
    it('should open delete modal when delete icon is clicked', () => {
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');

      component.getRoutesInventory();
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('.decline-icon'));
      buttons[0].triggerEventHandler('click', null);
      expect(dialogSpy).toBeCalledTimes(1);
    });
  });

  describe('deleteRoute', () => {
    beforeEach(() => {
      jest.spyOn(routesInventoryMock, 'deleteRouteBatch');
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should delete a route batch on success response from http call', () => {
      const spy = jest.spyOn(component, 'getRoutesInventory');
      jest.spyOn(routesInventoryMock, 'deleteRouteBatch').mockReturnValue(of({
        success: true,
        message: 'batch deleted successfully'
      }));
      component.getRoutesInventory();
      fixture.detectChanges();

      component.deleteRoute(1);

      expect(routesInventoryMock.deleteRouteBatch).toHaveBeenCalled();
      expect(alert.success).toBeCalledWith('batch deleted successfully');
      expect(spy).toBeCalled();
    });

    it('should show error alert route batch on failed response from http call', () => {
      jest.spyOn(routesInventoryMock, 'deleteRouteBatch').mockReturnValue(of({
        success: false,
        message: 'something went wrong'
      }));

      component.getRoutesInventory();
      fixture.detectChanges();
      component.deleteRoute(1);

      expect(routesInventoryMock.deleteRouteBatch).toHaveBeenCalled();
      expect(alert.error).toBeCalledWith('something went wrong');
      expect(component.routes.length).toBe(5);
    });
  });

  describe('Search Routes', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should return list of all routes when no name is provided', async(() => {
      component.getSearchResults();
      fixture.detectChanges();
      expect(component.routes).toEqual(getRoutesResponseMock.routes);

      const button = fixture.debugElement.queryAll(By.css('.arrow-icon-button'));
      expect(button.length).toEqual(2);
    }));

    it('should throw error when routes not loaded successfully', async(() => {
      spyOn(SearchService.prototype, 'searchData')
        .and.returnValue(throwError('error'));

      component.getSearchResults();
      fixture.detectChanges();
      expect(component.displayText).toEqual(`Oops! We're having connection problems.`);
    }));

    it('should return list of filtered routes when name is provided', async(() => {
      jest.spyOn(component, 'getSearchResults');
      jest.spyOn(SearchService.prototype, 'searchData').mockReturnValue(of(getRoutesResponseMock));
      const appServiceSpy = jest.spyOn(AppEventService.prototype, 'broadcast');
      component.getRoutesInventory();

      fixture.detectChanges();
      component.getSearchResults();

      fixture.detectChanges();

      expect(component.getSearchResults).toHaveBeenCalled();
      expect(appServiceSpy).toHaveBeenCalled();
      expect(component.routes).toEqual(getRoutesResponseMock.routes);
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions on ngOnDestroy', () => {
      component.updateSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();

      expect(component.updateSubscription.unsubscribe).toBeCalledTimes(1);
    });
  });
});
