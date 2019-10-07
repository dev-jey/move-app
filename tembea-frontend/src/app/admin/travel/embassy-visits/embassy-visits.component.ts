import { Component } from '@angular/core';
import { TripItineraryComponent } from '../../trips/trip-itinerary/trip-itinerary.component';

@Component({
  selector: 'app-embassy-visits',
  templateUrl: '../../trips/trip-itinerary/trip-itinerary.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    '../../trips/trip-itinerary/trip-itinerary.component.scss',
    '../airport-transfers/airport-transfers.component.scss'
  ]
})
export class EmbassyVisitsComponent extends TripItineraryComponent {
  tripType = 'Embassy Visit';
}
