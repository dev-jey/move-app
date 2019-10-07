import { EventEmitter } from 'events';

const eventsEmitter = new EventEmitter();

export const slackEventNames = Object.freeze({
  TRIP_APPROVED: 'trip_approved'
});

export class SlackEvents {
  static raise(eventName, ...args) {
    eventsEmitter.emit(eventName, ...args);
  }

  static handle(eventName, handler) {
    eventsEmitter.on(eventName, handler);
  }
}
