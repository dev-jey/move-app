import { SlackEvents, slackEventNames } from './slackEvents';
import ManagerNotificationEvents from '../trips/manager/manager-notification-events';

const slackEvents = SlackEvents;

slackEvents.handle(slackEventNames.TRIP_APPROVED,
  ManagerNotificationEvents.sendOperationsTripRequestNotification);

export default slackEvents;
