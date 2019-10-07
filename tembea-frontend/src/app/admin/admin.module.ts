import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CabInventoryComponent } from './cabs/cab-inventory/cab-inventory.component';
import { CreateRouteComponent } from './routes/create-route/create-route.component';
import { RoutesInventoryComponent } from './routes/routes-inventory/routes-inventory.component';
import { SettingsComponent } from './settings/settings.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouteRequestsComponent } from './routes/route-requests/route-requests.component';
import { EmptyPageComponent } from './empty-page/empty-page.component';
import { CustomTitlecasePipe } from './__pipes__/custom-titlecase.pipe';
import { ConvertTimePipe } from './__pipes__/convert-time.pipe';
import { AlertService } from '../shared/alert.service';
import { ShortenNamePipe } from './__pipes__/shorten-name.pipe';
import { GoogleMapsService } from '../shared/googlemaps.service';
import { CreateRouteHelper } from './routes/create-route/create-route.helper';
import { AppPaginationComponent } from './layouts/app-pagination/app-pagination.component';

import { environment } from '../../environments/environment';
import { DepartmentsComponent } from './settings/departments/departments.component';
import { TripItineraryComponent } from './trips/trip-itinerary/trip-itinerary.component';
import { TripNavComponent } from './trips/trip-nav/trip-nav.component';
import { PendingRequestComponent } from './trips/pending-request/pending-request.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatButtonModule, MatProgressBarModule
} from '@angular/material';
import { CustomDropdownComponent } from './layouts/custom-dropdown/custom-dropdown.component';
import { ExportComponent } from './export-component/export.component';
import { EmbassyVisitsComponent } from './travel/embassy-visits/embassy-visits.component';
import { AirportTransfersComponent } from './travel/airport-transfers/airport-transfers.component';
import { FellowsComponent } from './settings/fellows/fellows.component';
import { FellowCardComponent } from './settings/fellows/fellow-card/fellow-card.component';
import { DeleteFellowModalComponent } from './settings/fellows/delete-fellow-dialog/delete-dialog.component';
import { FellowComponent } from './settings/fellows/fellow/fellow.component';
import { PastTripsComponent } from './trips/past-trips/past-trips.component';
import { CabCardComponent } from './cabs/cab-inventory/cab-card/cab-card.component';
import { DeleteCabModalComponent } from './cabs/cab-inventory/delete-cab-dialog/delete-cab-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RatingStarsComponent } from './rating-stars/rating-stars.component';
import { FellowNavComponent } from './settings/fellows/fellow-nav/fellow-nav.component';
import { RoutesOverviewComponent } from './dashboard/routes-overview/routes-overview.component';
import { DisplayTripModalComponent } from './trips/display-trip-modal/display-trip-modal.component';
import { ProviderInventoryComponent } from './providers/provider-inventory/provider-inventory.component';
import { ProviderCardComponent } from './providers/provider-card/provider-card.component';
import { ProviderModalComponent } from './providers/provider-modal/provider-modal.component';
import { AddProviderModalComponent } from './providers/add-provider-modal/add-provider-modal.component';
import { ProviderFilterComponent } from './providers/provider-filter/provider-filter.component';
import { DriverModalComponent } from './providers/driver-modal/driver-modal.component';
import { RouteRatingsOverviewComponent } from './dashboard/route-ratings-overview/route-ratings-overview.component';
import { ProviderNavComponent } from './providers/provider-nav/provider-nav.component';
import { DriverInventoryComponent } from './drivers/driver-inventory/driver-inventory.component';
import { DriverCardComponent } from './drivers/driver-card/driver-card.component';
import { BaseInventoryComponent } from './base-inventory/base-inventory.component';
import { DeleteDriverDialogComponent } from './drivers/delete-driver-dialog/delete-driver-dialog.component';
import { DriverEditModalComponent } from './drivers/driver-edit-modal/driver-edit-modal.component';
import { TripAwaitingProviderComponent } from './trips/trip-awaiting-provider/trip-awaiting-provider.component';
import { ConvertNullValue } from './__pipes__/convert-nullValue.pipe';
import { ShortenTextPipe } from './__pipes__/shorten-text.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    CabInventoryComponent,
    CreateRouteComponent,
    RoutesInventoryComponent,
    SettingsComponent,
    PendingRequestComponent,
    HeaderComponent,
    RouteRequestsComponent,
    EmptyPageComponent,
    CustomTitlecasePipe,
    ConvertTimePipe,
    ShortenNamePipe,
    AppPaginationComponent,
    ConvertTimePipe,
    DepartmentsComponent,
    AppPaginationComponent,
    TripItineraryComponent,
    TripNavComponent,
    PendingRequestComponent,
    DatePickerComponent,
    CustomDropdownComponent,
    ExportComponent,
    EmbassyVisitsComponent,
    AirportTransfersComponent,
    FellowsComponent,
    FellowCardComponent,
    DeleteFellowModalComponent,
    FellowComponent,
    PastTripsComponent,
    CabCardComponent,
    DeleteCabModalComponent,
    RatingStarsComponent,
    FellowNavComponent,
    RoutesOverviewComponent,
    DisplayTripModalComponent,
    ProviderInventoryComponent,
    ProviderCardComponent,
    ProviderModalComponent,
    AddProviderModalComponent,
    ProviderFilterComponent,
    DriverModalComponent,
    RouteRatingsOverviewComponent,
    ProviderNavComponent,
    DriverInventoryComponent,
    DriverCardComponent,
    BaseInventoryComponent,
    DeleteDriverDialogComponent,
    DriverEditModalComponent,
    TripAwaitingProviderComponent,
    ConvertNullValue,
    ShortenTextPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    FormsModule,
    AngularMaterialModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googMapsAPIKey,
      libraries: ['places']
    }),
    AgmDirectionModule,
    MatProgressBarModule
  ],
  entryComponents: [
    DeleteFellowModalComponent, DeleteCabModalComponent,
    DisplayTripModalComponent, ProviderModalComponent, AddProviderModalComponent, DriverModalComponent,
    DeleteDriverDialogComponent,
    DriverEditModalComponent
  ],
  providers: [AlertService, GoogleMapsService, CreateRouteHelper]
})
export class AdminModule { }
