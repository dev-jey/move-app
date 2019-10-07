import { DepartmentsService } from '../departments.service';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { getDepartmentsMock } from '../../routes/routes-inventory/__mocks__/get-departments.mock';
import { DepartmentsModel } from 'src/app/shared/models/departments.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let httpMock: HttpTestingController;

  const deleteResponseMock = {
    success: true,
    message: 'department deleted successfully'
  };

  const getDepartmentsResponse = new DepartmentsModel()
    .deserialize(getDepartmentsMock);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartmentsService]
    });
    service = TestBed.get(DepartmentsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    httpMock.verify();
  });


  describe('getDepartments', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make http request to get Departments', () => {
      service.get(1, 2).subscribe(
        data => {
          const { pageMeta } = data;
          expect(pageMeta.page).toEqual(1);
          expect(pageMeta.pageSize).toEqual(2);
        });
      const url2 = `${environment.tembeaBackEndUrl}/api/v1/departments?size=1&page=2`;
      const mockDepartments: TestRequest = httpMock.expectOne(url2);

      expect(mockDepartments.request.method).toEqual('GET');
      mockDepartments.flush(getDepartmentsResponse);
    });
  });

  describe('Add Departments', () => {
    it('should http request to post Departments', () => {
      const department = {
        body: {
          name: 'launchpad',
          email: 'tembea@andela.com',
          slackUrl: 'ASE32YL',
          location: 'Nairobi'
        }
      };
      const spy = jest.spyOn(HttpClient.prototype, 'post');
      spy.mockReturnValue(of({ success: true }));
      const result = service.add(department);
      result.subscribe( data => {
        expect(data.success).toEqual(true);
      });
    });
  });

  describe('deleteDepartment', () => {
    it('should make http request to delete department by Id', () => {
      const spy = jest.spyOn(HttpClient.prototype, 'delete');
      spy.mockReturnValue(of(deleteResponseMock));
      const result = service.delete(1);
      result.subscribe(data => {
        expect(data).toEqual(deleteResponseMock);
      });
      expect(JSON.stringify(result)).toEqual(JSON.stringify(of(deleteResponseMock)));
    });
  });

  describe('updateDepartment', () => {
    it('should make http request to update department', () => {
      const spy = jest.spyOn(HttpClient.prototype, 'put');
      const updateResponseMock = {
        success: true
      };
      spy.mockReturnValue(of({ success: true }));
      const result = service.update('abc', 'Launchpad', 'barak', 'Lagos');
      result.subscribe(data => {
        expect(data).toEqual(updateResponseMock);
      });
      expect(JSON.stringify(result)).toEqual(JSON.stringify(of(updateResponseMock)));
    });
  });

});
