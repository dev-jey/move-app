import { Component, Input } from '@angular/core';
import {TripItineraryComponent} from '../trip-itinerary/trip-itinerary.component';

@Component({
  selector: 'app-past-trips',
  templateUrl: './past-trips.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    '../../trips/trip-itinerary/trip-itinerary.component.scss',
    '../../travel/airport-transfers/airport-transfers.component.scss'
  ],
})
export class PastTripsComponent extends TripItineraryComponent {
  tripType = 'Regular Trip';
  @Input() tripRequestType: string;
}
