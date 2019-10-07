import { Injectable } from '@angular/core';
import { takeOffTimeFormat } from './createRouteUtils';
import { AlertService } from '../../../shared/alert.service';

@Injectable()
export class CreateRouteHelper {

  constructor(private toastr: AlertService) { }

  incrementCapacity(fieldValue) {
    const newValue = parseInt(fieldValue, 10) + 1;
    return newValue;
  }

  decrementCapacity(fieldValue) {
    const value = parseInt(fieldValue, 10);
    if (value < 2) { return 1; }

    const newValue = value - 1;
    return newValue;
  }

  createNewRouteRequestObject(formValues, destinationFormInput, coordinates) {
    const requestObject = { ...formValues };
    requestObject.destination = { address: destinationFormInput, coordinates };
    return requestObject;
  }

  validateFormEntries(formValues) {
    const { takeOffTime, capacity } = formValues;
    const errors: string[] = [];

    errors.push(
      ...this.validateInputFormat(takeOffTime, takeOffTimeFormat, 'Take-off Time')
    );
    errors.push(...this.validateCapacity(capacity, 'Capacity'));
    return errors;
  }

  validateInputFormat(value: string, regex, field: string): string[] {
    if (!regex.test(value)) { return [ `${field} is invalid`]; }
    return [];
  }

  validateCapacity(value: string, field): string[] {
    if (parseInt(value, 10) < 1) { return [`${field} must be an integer greater than zero`]; }
    return [];
  }

  notifyUser(messages: string[], notificationType: string = 'error') {
    messages.forEach(message => this.toastr[notificationType](message));
  }
}
