import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CabCardComponent } from './cab-card.component';
import { AlertService } from 'src/app/shared/alert.service';
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { of } from 'rxjs';


describe('CabCardComponent', () => {
  let component: CabCardComponent;
  let fixture: ComponentFixture<CabCardComponent>;

  const onDelete = jest.fn();
  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        executeFunction: {
          subscribe: () => onDelete()
        }
      },
      afterClosed: () => of()
    })
  };

  const alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };
  const mockCabsInventoryService = {
    delete: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabCardComponent ],
      imports: [ RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MatDialog, useValue: matDialogMock },
        { provide: AlertService, useValue: alert },
        { provide: CabsInventoryService, useValue: mockCabsInventoryService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  }));

  describe('CabCardComponent', () => {
    it('should create cab card component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('should open dialog successfully', () => {
      component.showCabDeleteModal(3);

      expect(matDialogMock.open).toBeCalledTimes(1);
      expect(onDelete).toBeCalledTimes(1);
    });

    it('should delete a cab successfully', () => {
      jest.spyOn(mockCabsInventoryService, 'delete').mockReturnValue(of({
        success: true,
        message: 'Cab deleted successfully'
      }));
      component.delete(3);
      expect(mockCabsInventoryService.delete).toHaveBeenCalled();
      expect(alert.success).toBeCalledWith('Cab deleted successfully');
    });

    it('should fail to delete a cab', () => {
      jest.spyOn(mockCabsInventoryService, 'delete').mockReturnValue(of({
        success: false,
        message: 'Something went wrong'
      }));
      component.delete(3);
      expect(mockCabsInventoryService.delete).toHaveBeenCalled();
      expect(alert.error).toBeCalledWith('Something went wrong');

    });

    it('should show more options', () => {
      jest.spyOn(component.showOptions, 'emit').mockImplementation();
      component.showMoreOptions();
      expect(component.showOptions.emit).toBeCalled();
    });

    it('should open edit dialog successfully', () => {
      jest.spyOn(matDialogMock, 'open');
      component.showCabEditModal();
      expect(matDialogMock.open).toHaveBeenCalled();
    });
  });
});
