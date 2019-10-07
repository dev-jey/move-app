import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { of } from 'rxjs';

import { DeleteDriverDialogComponent } from './delete-driver-dialog.component';
import { DriverCardComponent } from '../driver-card/driver-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from 'src/app/shared/alert.service';
import { mockToastr } from 'src/app/shared/__mocks__/mockData';
import { DriversInventoryService } from '../../__services__/drivers-inventory.service';

describe('DeleteDriverDialogComponent', () => {
  let component: DeleteDriverDialogComponent;
  let fixture: ComponentFixture<DeleteDriverDialogComponent>;
  let debugElement;

  const mockMatDialogData = {
    driver: {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@email.com',
      phoneNo: '08012345678',
      providerId: 1,
    }
  };

  const mockMatDialog = {
    open: jest.fn()
  };

  const mockMatDialogRef = {
    close: jest.fn(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDriverDialogComponent, DriverCardComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: AlertService, useValue: mockToastr },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDriverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  }));

  describe('initial load', () => {
    it('it should have the correct title', () => {
      const title = debugElement.query(By.css('.header-title')).nativeElement.innerHTML;
      expect(title).toEqual(' Are you sure you want to Delete? ');
    });
  });
  describe('delete', () => {
    let deleteDriverSpy;
    beforeEach(() => {
      deleteDriverSpy = jest.spyOn(DriversInventoryService.prototype, 'deleteDriver');
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('should remove a driver successfully when the delete button is clicked', () => {
      deleteDriverSpy.mockReturnValue(of({ success: true, message: 'Driver successfully deleted' }));
      const emitSpy = jest.spyOn(component.refresh, 'emit').mockImplementation(jest.fn());
      const button = debugElement.query(By.css('.confirm')).nativeElement;

      button.click();

      expect(mockToastr.success).toBeCalledWith('Driver successfully deleted');
      expect(emitSpy).toBeCalledTimes(1);
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
    it('should show an error toast if http error occurs', () => {
      deleteDriverSpy.mockReturnValue(of({ success: false, message: 'Driver does not exist' }));
      const button = debugElement.query(By.css('.confirm')).nativeElement;

      button.click();
      expect(mockToastr.error).toBeCalledWith('Driver does not exist');
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
