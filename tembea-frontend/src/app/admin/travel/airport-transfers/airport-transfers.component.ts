import { Component } from '@angular/core';
import { TripItineraryComponent } from '../../trips/trip-itinerary/trip-itinerary.component';

@Component({
  selector: 'app-airport-transfers',
  templateUrl: './airport-transfers.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    '../../trips/trip-itinerary/trip-itinerary.component.scss',
    './airport-transfers.component.scss'
  ]
})
export class AirportTransfersComponent extends TripItineraryComponent {
  tripType = 'Airport Transfer';
}
