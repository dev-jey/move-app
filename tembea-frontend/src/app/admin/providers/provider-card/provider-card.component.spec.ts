import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material';
import { Injector } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ProviderCardComponent } from './provider-card.component';
import { AppTestModule } from '../../../__tests__/testing.module';
import { ProviderService } from '../../__services__/providers.service';
import { AppEventService } from '../../../shared/app-events.service';
import { AlertService } from '../../../shared/alert.service';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { RouterTestingModule } from '@angular/router/testing';


const matDialogMock = {
  open: jest.fn().mockReturnValue({
    componentInstance: {
      executeFunction: {
        subscribe: () => of()
      }
    },
    afterClosed: () => of()
  }),
};
const mockMatDialogRef = {
  close: () => {},
};

const mockMatDialogData = {
  data: {
    displayText: 'display data',
    confirmText: 'yes'
  }
};
describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;
  let injector: Injector;
  let appEventService: any;
  let providerService: any;
  let alert: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCardComponent, ConfirmModalComponent ],
      providers: [{provide: MatDialog, useValue: matDialogMock},
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }],
      imports: [
        MatDialogModule, AppTestModule, BrowserAnimationsModule, NoopAnimationsModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = fixture.debugElement.injector;
    appEventService = injector.get(AppEventService);
    providerService = injector.get(ProviderService);
    alert = injector.get(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show more options', () => {
    jest.spyOn(component.showOptions, 'emit').mockImplementation();
    component.showMoreOptions();
    expect(component.hidden).toBe(true);
    expect(component.showOptions.emit).toBeCalled();
  });

  it('should open edit modal', () => {
    jest.spyOn(matDialogMock, 'open');
    component.openEditModal();
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  describe('Delete Provider', () => {
    it('should open confirmation model', () => {
      component.showDeleteModal();
      expect(matDialogMock.open).toHaveBeenCalled();
    });
    it('should call provider service on delete', () => {
      jest.spyOn(providerService, 'deleteProvider').mockReturnValue(of({}));
      component.deleteProvider(1);
      expect(providerService.deleteProvider).toHaveBeenCalled();
    });

    it('should toast success and broadcast on delete provider success', () => {
      jest.spyOn(alert, 'success');
      jest.spyOn(appEventService, 'broadcast');
      jest.spyOn(providerService, 'deleteProvider').mockReturnValue(of({
        success: true,
        message: 'Provider Deleted successfully'
      }));
      component.deleteProvider(1);
      expect(alert.success).toHaveBeenCalled();
      expect(appEventService.broadcast).toHaveBeenCalled();
    });

    it('should toast error on delete provider fail', () => {
      const error = { error: { message: 'error' } };
      jest.spyOn(alert, 'error');
      spyOn(ProviderService.prototype, 'deleteProvider').and.returnValue(throwError(error));
      component.deleteProvider(100);
      expect(alert.error).toHaveBeenCalled();
    });

    it('should call delete provider on confirmation', () => {
      jest.spyOn(component, 'deleteProvider');
      const fixtureModal = TestBed.createComponent(ConfirmModalComponent);
      const modalComponent = fixtureModal.componentInstance;
      component.showDeleteModal();
      modalComponent.confirmDialog();
      expect(component.deleteProvider).toHaveBeenCalled();
    });
    it('should hide on options on close dialog', () => {
      jest.spyOn(component, 'deleteProvider');
      const fixtureModal = TestBed.createComponent(ConfirmModalComponent);
      const modalComponent = fixtureModal.componentInstance;
      component.showDeleteModal();
      modalComponent.closeDialog();
      expect(component.hidden).toBeTruthy();
    });
    it('should unsubscribe updateSubscription on ngOnDestroy', () => {
      component.confirmDeleteSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.confirmDeleteSubscription.unsubscribe).toHaveBeenCalled();
    });
    it('should unsubscribe deleteSubscription on ngOnDestroy', () => {
      component.closeDialogSubscription = {
        unsubscribe: jest.fn()
      };
      component.ngOnDestroy();
      expect(component.closeDialogSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
