import { ExportService } from '../export.component.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';

describe('ExportComponent', () => {
  describe('exportToPDF', () => {
    let service: ExportService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });

      const testBed = getTestBed();
      service = testBed.get(ExportService);
      httpMock = testBed.get(HttpTestingController);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should make a get http call when exporting as pdf', async () => {
      await service.exportData('routes', 'name,asc,id,asc', {}, 'pdf')
        .subscribe((result) => {
          expect(result).toEqual('');
        });

      const request = httpMock.expectOne(`${service.exportToPDFUrl}?table=routes&sort=name,asc,id,asc`);
        expect(request.request.method).toEqual('GET');
    });

    it('should make a get http call when exporting as csv', async () => {
      await service.exportData('routes', 'name,asc,id,asc', {}, 'csv')
        .subscribe((result) => {
          expect(result).toEqual('');
        });

      const request = httpMock.expectOne(`${service.exportToCSVUrl}?table=routes&sort=name,asc,id,asc`);
        expect(request.request.method).toEqual('GET');
    });
  });
});
