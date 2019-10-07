import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnInit {
  @Input()
  dateFormat = 'YYYY-MM-DD';
  @Input()
  placeholder = 'Select Date';
  @Output()
  selectedDateChange: EventEmitter<string> = new EventEmitter();
  model = { selectedDate: null };

  constructor() {
  }

  ngOnInit() {
  }

  update(event: MatDatepickerInputEvent<Date>) {
    const date = moment(event.value.toISOString());
    this.model.selectedDate = date.format('DD MMMM, YYYY');
    this.selectedDateChange.emit(date.format(this.dateFormat));
  }
}
