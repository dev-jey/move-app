import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { HttpClient} from '@angular/common/http';
import { of } from 'rxjs';
import { ProviderService } from './providers.service';
import {createProviderMock, providerResponseMock} from '../providers/add-provider-modal/__mocks__/add-provider.mocks';


describe('ProvidersService', () => {
  let service: ProviderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProviderService]
    });
    service = TestBed.get(ProviderService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProviders', () => {
    beforeEach(() => {
      jest.spyOn(HttpClient.prototype, 'get');
    });
    it('should call HttpClient.getProviders', () => {
      service.getProviders(1, 1);
      expect(HttpClient.prototype.get).toBeCalled();
    });
    it('return all the providers', () => {
      jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
      const result = service.getProviders(1, 1);
      result.subscribe(data => {
        expect(data).toEqual({});
      });
    });
  });
  describe('Update Provider', () => {
    it('should call http client patch on update provider', () => {
      jest.spyOn(HttpClient.prototype, 'patch').mockReturnValue(of({}));
      service.editProvider({}, 1);
      expect(HttpClient.prototype.patch).toHaveBeenCalled();
    });
    it('should return data on http edit provider', () => {
      const response = {success: true};
      jest.spyOn(HttpClient.prototype, 'patch').mockReturnValue(of(response));
      const results = service.editProvider({}, 1);
      results.subscribe(data => {
        expect(data).toEqual(response);
      });
    });
  });

  describe('Delete Provider', () => {
    beforeEach(() => {
      jest.spyOn(HttpClient.prototype, 'delete');
    });
    it('should call Http client to delete Provider', () => {
      service.deleteProvider(1);
      expect(HttpClient.prototype.delete).toHaveBeenCalled();
    });

    it('should delete a provider successfully', () => {
      jest.spyOn(HttpClient.prototype, 'delete').mockReturnValue(of({}));
      service.deleteProvider(1).subscribe(data => {
        expect(data).toEqual({});
      });
    });

    describe('addProvider', () => {
      it('should add a new provider', () => {
        let provider = null;
        jest.spyOn(service, 'add').mockReturnValue(of(providerResponseMock));
        service.add(createProviderMock).subscribe(value => {
          provider = value;
        });
        expect(provider).toEqual(providerResponseMock);
      });

      it('should call http client post method on add provider', () => {
        const response = {success: true};
        jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of(response));
        service.add({});
        expect(HttpClient.prototype.post).toHaveBeenCalled();
      });
    });

    describe('add Driver', () => {
      const driverObject = {
        driverPhoneNo: 45678,
        driverName: 'Test User',
        driverNumber: '1222333',
        providerId: 1
      };
      const expected = {
        success: true,
        message: 'Driver successfully added',
        data: driverObject };

      it('should call http client post', () => {
        jest.spyOn(HttpClient.prototype, 'post').mockImplementation(
          () => {
            return of({expected});
          }
        );
        jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of({expected}));
        service.addDriver(driverObject);
        expect(HttpClient.prototype.post).toHaveBeenCalled();
      });
      it('should add a driver sucessfully', () => {
        let response = null;
        jest.spyOn(HttpClient.prototype, 'post').mockImplementation(
          () => {
            return of(expected);
          }
        );
        jest.spyOn(HttpClient.prototype, 'post').mockReturnValue(of({expected}));
        service.addDriver(driverObject).subscribe(data => {
          response = data;
        });
        expect(response.expected).toEqual(expected);
      });
    });
  });
});
