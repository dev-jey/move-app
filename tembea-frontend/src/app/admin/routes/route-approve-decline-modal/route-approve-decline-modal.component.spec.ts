import { of, throwError } from 'rxjs';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { RouteApproveDeclineModalComponent } from './route-approve-decline-modal.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { RouteRequestService } from '../../__services__/route-request.service';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from '../../../shared/app-events.service';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import {ProviderSelectorComponent} from './provider-selector/provider-selector.component';


describe('RouteApproveDeclineModalComponent', () => {
  let component: RouteApproveDeclineModalComponent;
  let fixture: ComponentFixture<RouteApproveDeclineModalComponent>;
  let injector: Injector;
  let authService: any;
  let routeService: any;
  const mockMatDialogData = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AppTestModule, AngularMaterialModule],
      declarations: [RouteApproveDeclineModalComponent, ProviderSelectorComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteApproveDeclineModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    injector = fixture.debugElement.injector;
    routeService = injector.get(RouteRequestService);
    authService = injector.get(AuthService);
  });

  beforeEach(() => {
    injector = fixture.debugElement.injector;
    const mockMatDialogRef: any = injector.get(MatDialogRef);
    const appEventService = injector.get(AppEventService);

    mockMatDialogRef.close.mockReturnValue({});

    jest.spyOn(authService, 'getCurrentUser').mockReturnValue({ email: '' });
    jest.spyOn(routeService, 'declineRequest').mockReturnValue(of({}));
    jest.spyOn(routeService, 'approveRouteRequest').mockReturnValue(of({}));
    jest.spyOn(appEventService, 'broadcast').mockImplementation();
    jest.spyOn(component, 'setLoading');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('Initial load', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('closeDialog', () => {
    it('should call dialogRef.close()', () => {
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('decline', () => {
    it('should toggle loading display on decline', () => {
      // @ts-ignore
      const appEventService = injector.get(AppEventService);

      component.decline({ comment: 'This route is beyond our acceptable limit' });

      expect(component.setLoading).toHaveBeenCalled();
      expect(component.loading).toBe(true);
      expect(routeService.declineRequest).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });
  });

  describe('approve', () => {
    it('should toggle loading display on approval', () => {
      // @ts-ignore
      component.selectedProvider = {
        id: 1, name: 'Andela Kenya', providerUserId: 1, user: { slackId: 'NONE'}
      };
      const appEventService = injector.get(AppEventService);
      component.approve({
        routeName: 'This route is beyond our acceptable limit',
        takeOff: '',
        provider: '',
        comment: ''
      });

      expect(component.setLoading).toHaveBeenCalled();
      expect(component.loading).toBe(true);
      expect(routeService.approveRouteRequest).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(appEventService.broadcast).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearRouteFields', () => {
    it('should reset input fields to empty when cab model(input) is empty', () => {
      component.approveForm = { form: { patchValue: jest.fn() } };
      const event = { target: { value: '' } };
      component.clearRouteFields(event);
      expect(component.disableOtherInput).toEqual(false);
      expect(component.approveForm.form.patchValue).toBeCalledTimes(1);
    });
  });

  describe('clickedRouteProvider', () => {
    const event = { click: { rawSample: 'UBE234A', sampleModel: 'Toyota'} };

    it('should patch the input fields of the form once a cab has been clicked', () => {
      component.approveForm = { form: { patchValue: jest.fn() } };
      component.clickedRouteProviders(event);
      expect(component.disableOtherInput).toEqual(true);
      expect(component.approveForm.form.patchValue).toBeCalledTimes(1);
    });

    it('test set', () => {
      component.setAuto(event);
      expect(component.auto).toEqual(event);
    });
  });

  describe('handleAction', () => {
    it('should terminate loading state when service error occur', () => {
      jest.spyOn(routeService, 'declineRequest').mockImplementation(() => throwError({}));
      component.handleAction(routeService.declineRequest());
      expect(component.setLoading).toBeCalledWith(false);
      expect(component.loading).toBeFalsy();
    });
  });
});
