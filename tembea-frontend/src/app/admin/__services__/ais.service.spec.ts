import {inject, TestBed} from '@angular/core/testing';

import { AisService } from './ais.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import AISUserMock from '../../__mocks__/AISUser.mock';
import { AISData } from 'src/app/shared/models/ais.model';

describe('AisService', () => {
  let service: AisService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
    service = TestBed.get(AisService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getResponse(): should return user data from AIS', (done) => {
    let userData: AISData;
    service.getResponse('test.user@test.com').subscribe(value => {
      userData = value;
      expect(userData).toEqual(AISUserMock);
    });

    const request = httpMock.expectOne(`${service.baseUrl}?email=test.user@test.com`);
    expect(request.request.method).toEqual('GET');
    request.flush(AISUserMock);
    done();
});
});

