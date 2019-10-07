import moment from 'moment';
import GeneralValidator from './GeneralValidator';
import UserInputValidator from '../helpers/slack/UserInputValidator';
import HttpError from '../helpers/errorHandler';
import { TripService } from '../services/TripService';
import Response from '../helpers/responseHelper';
import TripHelper from '../helpers/TripHelper';

class TripValidator {
  static async validateAll(req, res, next) {
    const {
      query: { action },
      body: { isAssignProvider }
    } = req;
    let messages = GeneralValidator.validateReqBody(req.body, 'comment', 'slackUrl');
    if (action === 'confirm' && !isAssignProvider) {
      messages = [
        ...messages,
        ...GeneralValidator.validateReqBody(req.body, 'driverName', 'driverPhoneNo', 'regNumber'),
      ];
    }

    const { params: { tripId } } = req;
    if (!tripId) {
      messages.push('Add tripId to the url');
    }

    const isTrip = await TripService.checkExistence(tripId);

    if (!isTrip) {
      messages.push('Trip Does not exist');
    }
    if (messages.length) {
      return HttpError.sendErrorResponse({ message: messages }, res);
    }
    next();
  }

  static validateEachInput(req, res, next) {
    const {
      params: { tripId },
      query: { action },
      body
    } = req;
    const { slackUrl, isAssignProvider } = body;
    const messages = [
      ...TripValidator.validateTripId(tripId),
      ...TripValidator.validateSlackUrl(slackUrl),
    ];

    if (action === 'confirm' && !isAssignProvider) {
      messages.push(...UserInputValidator.validateCabDetails({ submission: body }));
    }

    if (messages.length) {
      return HttpError.sendErrorResponse({ message: messages }, res);
    }
    const regex = /https?:\/\//i;
    const trimmedSlackUrl = body.slackUrl.replace(regex, '');
    req.body.slackUrl = trimmedSlackUrl.trim();
    next();
  }

  /**
   * Validates and returns an error for invalid tripId value
   *
   * @static
   * @param {string|number} value - Trip id value
   * @returns {{ name: string, error: string }} - The error object
   * @memberof TripValidator
   */
  static validateTripId(value) {
    return !GeneralValidator.validateNumber(value)
      ? [{
        name: 'tripId',
        error: 'Invalid tripId in the url it must be a number. eg: api/v1/trips/12/confirm'
      }] : [];
  }

  /**
   * Validates and returns an error for invalid slackUrl value
   *
   * @static
   * @param {string} value - Slack url value
   * @returns {{ name: string, error: string }} - The error object
   * @memberof TripValidator
   */
  static validateSlackUrl(value) {
    return !GeneralValidator.validateTeamUrl(value)
      ? [{
        name: 'slackUrl',
        error: 'Invalid slackUrl. e.g: ACME.slack.com'
      }] : [];
  }

  static validateGetTripsParam(req, res, next) {
    const errors = [];
    const { query: { status } } = req;
    const acceptedStatus = ['Confirmed', 'Pending', 'Approved', 'Completed',
      'DeclinedByManager', 'DeclinedByOps', 'InTransit', 'Cancelled'];
    if (status && !acceptedStatus.includes(status)) {
      errors.push('Status can be either \'Approved\','
          + ' \'Confirmed\' , \'Pending\',  \' Completed\','
          + ' \'DeclinedByManager\', \'DeclinedByOps\', \'InTransit\' or \'Cancelled\'');
    }
    const departureTime = TripHelper.cleanDateQueryParam(req.query, 'departureTime');
    const requestedOn = TripHelper.cleanDateQueryParam(req.query, 'requestedOn');

    const param = { departureTime, requestedOn };

    errors.push(...TripValidator.validateDateParam(param, 'departureTime'));

    errors.push(...TripValidator.validateDateParam(param, 'requestedOn'));

    TripValidator.extracted(departureTime, errors, 'departureTime');
    TripValidator.extracted(requestedOn, errors, 'requestedOn');

    if (errors.length) {
      return Response.sendResponse(res, 400, false, 'Validation Error', { errors });
    }

    return next();
  }

  static extracted(requestedOn, errors, field) {
    if (requestedOn) {
      const { after, before } = requestedOn;
      errors.push(...TripValidator.validateTime(after, before, field));
    }
  }

  static validateTime(after, before, field) {
    let message;
    const errors = [];
    message = TripValidator.validateTimeFormat(after, `${field} 'after'`);
    if (message) {
      errors.push(message);
    }
    message = TripValidator.validateTimeFormat(before, `${field} 'before'`);
    if (message) {
      errors.push(message);
    }

    if (!TripValidator.validateTimeOrder(after, before)) {
      errors.push(`${field} 'before' date cannot be less than 'after' date`);
    }
    return errors;
  }

  static validateTimeFormat(time, field) {
    const formattedTime = moment(time || '', 'YYYY-MM-DD');
    if (time && !formattedTime.isValid()) {
      return (`${field} date is not valid. It should be in the format 'YYYY-MM-DD'`);
    }
  }

  static validateTimeOrder(dateFrom, dateTo) {
    const from = moment(dateFrom, 'YYYY-MM-DD');
    const to = moment(dateTo, 'YYYY-MM-DD');
    const isAfter = to.isAfter(from);
    const isValid = from.isValid() && to.isValid();
    if (!dateFrom || !dateTo) {
      return true;
    }
    return isValid && isAfter;
  }

  static validateDateParam(data, field) {
    const dateFormat = `must be in the format ${field}=before:YYYY-MM-DD;after:YYYY-MM-DD`;
    const invalidKeys = Object.keys(data[field] || {})
      .filter(key => key !== 'after' && key !== 'before');
    if (invalidKeys.length) {
      return [(`Invalid format, ${field} ${dateFormat}`)];
    }
    return [];
  }
}

export default TripValidator;
