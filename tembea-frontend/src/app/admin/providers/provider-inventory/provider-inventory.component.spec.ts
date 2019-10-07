import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { throwError, of } from 'rxjs';
import { Injector } from '@angular/core';
import { ProviderInventoryComponent } from './provider-inventory.component';
import { SearchService } from '../../__services__/search.service';
import { AppTestModule } from '../../../__tests__/testing.module';
import providersMock from '../../../__mocks__/providers.mock';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ProviderService } from '../../__services__/providers.service';


describe('ProvidersComponent', () => {
  let component: ProviderInventoryComponent;
  let fixture: ComponentFixture<ProviderInventoryComponent>;
  let injector: Injector;
  let searchService: any;
  let appEventService: any;
  let providerService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderInventoryComponent],
      imports: [AppTestModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
    fixture = TestBed.createComponent(ProviderInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = fixture.debugElement.injector;
    searchService = injector.get(SearchService);
    appEventService = injector.get(AppEventService);
    providerService = injector.get(ProviderService);
  }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  describe('should create', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('getSearchResults', () => {
    it('should return search results', () => {
      jest.spyOn(searchService, 'searchData').mockReturnValue(of({
        ...providersMock.data
      }));
      jest.spyOn(appEventService, 'broadcast').mockImplementation();

      component.getSearchResults('Ronald');

      expect(component.providers).toEqual([{
        'id': 1,
        'name': 'Ronald',
        'providerUserId': 15,
        'user': {
          'name': 'Ronald Okello',
          'phoneNo': null,
          'email': 'ronald.okello@andela.com'
        }
      }]);
      expect(searchService.searchData).toHaveBeenCalledTimes(1);
      expect(component.totalItems).toEqual(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });

    it('should return errors if wrong search name is given', () => {
      spyOn(SearchService.prototype, 'searchData')
        .and.returnValue(throwError('error'));

      component.getSearchResults('Ronald');
      fixture.detectChanges();
      expect(component.displayText).toEqual(`Oops! We're having connection problems.`);
    });
  });

  describe('ngOnInit', () => {
    it('should call the getProvidersData method', () => {
      jest.spyOn(component, 'getProvidersData').mockImplementation();
      component.ngOnInit();
      expect(component.getProvidersData).toBeCalledTimes(1);
    });

    it('should set pagination', () => {
      jest.spyOn(component, 'getProvidersData').mockImplementation();
      component.setPage(2);
      expect(component.pageNo).toEqual(2);
      expect(component.getProvidersData).toBeCalled();
      expect(component.providers).toEqual([]);
    });

    it('should show options', () => {
      component.currentOptions = 1;
      component.showOptions(-1);
      expect(component.currentOptions).toEqual(-1);
    });
  });

  describe('getProvidersData', () => {
    it('should return providers\' data', () => {
      jest.spyOn(providerService, 'getProviders').mockReturnValue(of(providersMock));

      component.getProvidersData();

      expect(providerService.getProviders).toHaveBeenCalledTimes(1);
      expect(component.providers).toEqual([{
        'id': 1,
        'name': 'Ronald',
        'providerUserId': 15,
        'user': {
          'name': 'Ronald Okello',
          'phoneNo': null,
          'email': 'ronald.okello@andela.com'
        }
      }]);
      expect(component.totalItems).toEqual(1);
    });

    it('should return errors if the app fails to get data', () => {
      spyOn(providerService, 'getProviders')
        .and.returnValue(throwError('error'));
      component.getProvidersData();
      fixture.detectChanges();
      expect(component.displayText).toEqual(`Oops! We're having connection problems.`);
    });

    it('should unsubscribe updateSubscription on ngOnDestroy', () => {
      component.updateSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.updateSubscription.unsubscribe).toHaveBeenCalled();
    });
    it('should unsubscribe deleteSubscription on ngOnDestroy', () => {
      component.deleteSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.deleteSubscription.unsubscribe).toHaveBeenCalled();
    });
    });
  });
