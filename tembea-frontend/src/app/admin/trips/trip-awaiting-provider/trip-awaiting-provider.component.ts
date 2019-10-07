import { Component, Input } from '@angular/core';
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';

@Component({
  selector: 'app-trip-awaiting-provider',
  templateUrl: './trip-awaiting-provider.component.html',
  styleUrls: [
    './trip-awaiting-provider.component.scss',
    '../../travel/airport-transfers/airport-transfers.component.scss'
  ]
})
export class TripAwaitingProviderComponent extends TripItineraryComponent {
  @Input() tripRequestType: string;
}
