import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GoogleMapsService } from '../../../shared/googlemaps.service';
import { Location } from '../../../shared/location.model';
import { CreateRouteHelper } from './create-route.helper';
import { RoutesInventoryService } from '../../__services__/routes-inventory.service';
import {NavMenuService} from '../../__services__/nav-menu.service';

class RouteModel {
  constructor(public routeName?: string,
    public takeOffTime?: string,
    public capacity?: number,
    public vehicle?: string,
    public marker?: string,
    public destinationInputField?: string) { }
}

@Component({
  selector: 'app-create',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements AfterViewInit {
  lat = -1.219539;
  lng = 36.886215;
  zoom = 8;
  destinationIsDojo = true;
  origin = { lat: this.lat, lng: this.lng };
  destination: Location = { lat: this.lat, lng: this.lng };
  destinationCoordinates: Location;

  model: RouteModel;

  @ViewChild('destinationFormInput') destinationInputElement: ElementRef;

  mouseoverCreateButton;
  constructor(
    public googleMapsService: GoogleMapsService,
    private routeService: RoutesInventoryService,
    public createRouteHelper: CreateRouteHelper,
    private router: Router,
    private navMenuService: NavMenuService
  ) {
    this.model = new RouteModel();
    this.model.capacity = 1;

  }

  ngAfterViewInit() {
    this.googleMapsService
      .loadGoogleMaps(this.destinationInputElement.nativeElement);
  }

  async showRouteDirectionOnClick() {
    try {
      const addressInput = this.destinationInputElement.nativeElement.value;

      const coordinates = await this.googleMapsService
      .getLocationCoordinatesFromAddress(addressInput);
      this.updateRouteDisplay(coordinates);

    } catch (error) {
      this.createRouteHelper.notifyUser(['Location not found']);
    }
  }

  async updateDestinationFieldOnMarkerDrag(marker, $event) {

    const locationAddress = await this.googleMapsService
      .getLocationAddressFromCoordinates($event.coords);
    this.model.destinationInputField = locationAddress;
    this.updateRouteDisplay($event.coords);
  }

  clearDestinationCoordinates() {
    this.destinationCoordinates = null;
  }

  updateRouteDisplay(coordinates) {
    this.destination = coordinates; // update map marker
    this.destinationCoordinates = coordinates;
    this.toggleMapDisplay();
  }

  toggleMapDisplay() {
    this.destinationIsDojo = true;
    this.destinationIsDojo = false;
  }
  changeCapacityValue(methodToCall: string) {
    this.model.capacity = this.createRouteHelper[methodToCall](this.model.capacity);
  }

  async createRoute() {
    if (!this.destinationCoordinates) {
      return this.createRouteHelper.notifyUser(
        ['Click the search icon to confirm destination']
      );
    }
    const routeRequest = this.createRouteHelper.createNewRouteRequestObject(
      this.model, this.model.destinationInputField, this.destinationCoordinates
    );

    const errors = this.createRouteHelper.validateFormEntries(routeRequest);
    if (errors.length) {
      return this.createRouteHelper.notifyUser(errors);
    }

    return this.sendRequestToServer(routeRequest);
  }

  async sendRequestToServer(data) {
    try {
      this.navMenuService.showProgress();
      const response = await this.routeService.createRoute(data);
      this.navMenuService.stopProgress();
      this.createRouteHelper.notifyUser([response.message], 'success');
      this.model = null;
      this.router.navigate(['/admin/routes/inventory']);
    } catch (e) {
      this.navMenuService.stopProgress();
      this.createRouteHelper.notifyUser([e.error.message || 'An error occurred.']);
    }
  }
}
