import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './admin/confirmation-dialog/confirmation-dialog.component';
import { ClockService } from './auth/__services__/clock.service';
import { ActiveTimeDirective } from './active-time.directive';
import { HomeComponent } from './home/home.component';
import { Toastr, TOASTR_TOKEN } from './shared/toastr.service';
import { CookieService } from './auth/__services__/ngx-cookie-service.service';
import { UnauthorizedLoginComponent } from './auth/unauthorized-login/unauthorized-login.component';
import { LoginRedirectComponent } from './auth/login-redirect/login-redirect.component';
import { AuthService } from './auth/__services__/auth.service';
import { AngularMaterialModule } from './angular-material.module';
import { JwtHttpInterceptor } from './shared/jwt-http.interceptor';
import { RouteApproveDeclineModalComponent } from './admin/routes/route-approve-decline-modal/route-approve-decline-modal.component';

import { AlertService } from './shared/alert.service';
import { RoutesInventoryEditModalComponent
} from './admin/routes/routes-inventory/routes-inventory-edit-modal/routes-inventory-edit-modal.component';
import { errorHandlerFactory } from './shared/bugsnag.service';
import { AddDepartmentsModalComponent } from './admin/settings/departments/add-departments-modal/add-departments-modal.component';
import { TripApproveDeclineModalComponent } from './admin/trips/trip-approve-decline-modal/trip-approve-decline-modal.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AddCabsModalComponent } from './admin/cabs/add-cab-modal/add-cab-modal.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {ProviderSelectorComponent} from './admin/routes/route-approve-decline-modal/provider-selector/provider-selector.component';


const toastr: Toastr = window['toastr'];

@NgModule({
  declarations: [
    ActiveTimeDirective,
    AppComponent,
    HomeComponent,
    UnauthorizedLoginComponent,
    LoginRedirectComponent,
    RouteApproveDeclineModalComponent,
    ConfirmModalComponent,
    RoutesInventoryEditModalComponent,
    AddDepartmentsModalComponent,
    TripApproveDeclineModalComponent,
    AddCabsModalComponent,
    PageNotFoundComponent,
    ProviderSelectorComponent
  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AuthService,
    AlertService,
    CookieService,
    ClockService,
    { provide: TOASTR_TOKEN, useValue: toastr },
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true },
    { provide: ErrorHandler, useFactory: errorHandlerFactory }
  ],
  entryComponents: [
    UnauthorizedLoginComponent,
    ConfirmModalComponent,
    RouteApproveDeclineModalComponent,
    RoutesInventoryEditModalComponent,
    AddDepartmentsModalComponent,
    TripApproveDeclineModalComponent,
    AddCabsModalComponent,
    ProviderSelectorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
