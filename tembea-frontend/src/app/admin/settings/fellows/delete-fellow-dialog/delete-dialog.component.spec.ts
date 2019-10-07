import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DeleteFellowModalComponent } from './delete-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AlertService } from 'src/app/shared/alert.service';
import { mockToastr } from 'src/app/shared/__mocks__/mockData';
import { By } from '@angular/platform-browser';
import { FellowCardComponent } from '../fellow-card/fellow-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FellowsService } from '../../../__services__/fellows.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('DeleteFellowModalComponent', () => {
  let fixture: ComponentFixture<DeleteFellowModalComponent>;
  let component: DeleteFellowModalComponent;
  let debugElement;

  const mockMatDialogRef = {
    close: jest.fn(),
  };
  const mockMatDialogData = {
    fellow: {
      name: 'fellow', image: 'image', partner: 'partner', id: 3,
      tripsTaken: 10, startDate: '2019-01-23T00:00:00.000Z', endDate: '2020-01-23T00:00:00.000Z'
    }
  };
  const mockMatDialog = {
    open: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFellowModalComponent, FellowCardComponent ],
      imports: [ HttpClientTestingModule,  RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: AlertService, useValue: mockToastr },
        { provide: MatDialog, useValue: mockMatDialog}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteFellowModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  }));

  describe('initial load', () => {
    it('should have correct title', () => {
      const title = debugElement.query(By.css('.header-title')).nativeElement.innerHTML;
      expect(title).toEqual(' Are you sure you want to Remove? ');
    });
  });

  describe('closeDialog', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should call dialogRef.close() when closeDialog() is called', () => {
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

  describe('deleteFellow', () => {
    let deleteFellowSpy;
    beforeEach(() => {
      deleteFellowSpy = jest.spyOn(FellowsService.prototype, 'removeFellowFromRoute');
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('should remove a fellow successfully when delete button is clicked', () => {
      deleteFellowSpy.mockReturnValue(of({ success: true, message: 'fellow removed successfully' }));
      const emitSpy = jest.spyOn(component.removeUser, 'emit').mockImplementation(jest.fn());
      const button = debugElement.query(By.css('.confirm')).nativeElement;

      button.click();

      expect(mockToastr.success).toBeCalledWith('fellow removed successfully');
      expect(emitSpy).toBeCalledTimes(1);
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should show an error toast if a http error occurs', () => {
      deleteFellowSpy.mockReturnValue(throwError(new Error()));

      component.deleteFellow();

      expect(mockToastr.error).toBeCalledWith(
        'Something went terribly wrong, we couldn\`t remove the fellow. Please try again.'
      );
      expect(mockMatDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
