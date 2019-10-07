import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeleteCabModalComponent } from './delete-cab-dialog.component';
import { AlertService } from 'src/app/shared/alert.service';
import { mockToastr } from 'src/app/shared/__mocks__/mockData';
import { CabCardComponent } from '../cab-card/cab-card.component';
import { CabsInventoryService } from '../../../__services__/cabs-inventory.service';

describe('DeleteCabDialogComponent', () => {
  let component: DeleteCabModalComponent;
  let fixture: ComponentFixture<DeleteCabModalComponent>;
  let debugElement;

  const mockMatDialogData = {
    cab: {
      id: 1,
      model: 'Audi',
      regNumber: 'KCD 434',
      capacity: 2
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
      declarations: [ DeleteCabModalComponent, CabCardComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: AlertService, useValue: mockToastr },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCabModalComponent);
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

  describe('closeDialog', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('it should call dialogRef.close() when closeDialog() is called', () => {
      component.closeDialog();
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog when close button is clicked', () => {
      const button = debugElement.query(By.css('.close-button')).nativeElement;
      button.click();
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should close the dialog when cancel button is clicked', () => {
      const button = debugElement.query(By.css('.cancel')).nativeElement;
      button.click();
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    let deleteCabSpy;
    beforeEach(() => {
      deleteCabSpy = jest.spyOn(CabsInventoryService.prototype, 'delete');
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('should remove a cab successfully when the delete button is clicked', () => {
      deleteCabSpy.mockReturnValue(of({ success: true, message: 'Cab successfully deleted' }));
      const emitSpy = jest.spyOn(component.refresh, 'emit').mockImplementation(jest.fn());
      const button = debugElement.query(By.css('.confirm')).nativeElement;

      button.click();

      expect(mockToastr.success).toBeCalledWith('Cab successfully deleted');
      expect(emitSpy).toBeCalledTimes(1);
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should show an error toast if http error occurs', () => {
      deleteCabSpy.mockReturnValue(of({ success: false, message: 'Cab does not exist' }));
      const button = debugElement.query(By.css('.confirm')).nativeElement;

      button.click();
      expect(mockToastr.error).toBeCalledWith('Cab does not exist');
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
