import { createMessageAdapter } from '@slack/interactive-messages';
import SlackInteractions from './index';
import ManagerController from '../RouteManagement/ManagerController';
import { OperationsHandler } from '../RouteManagement/OperationsController';
import OperationsHelper from '../helpers/slackHelpers/OperationsHelper';
import JoinRouteInteractions from '../RouteManagement/JoinRoute/JoinRouteInteractions';
import RateTripController from '../TripManagement/RateTripController';
import TripInteractions from '../SlackPrompts/notifications/TripNotifications/TripInteractions';
import TripCabController from '../TripManagement/TripCabController';
import SlackInteractionsHelpers from '../helpers/slackHelpers/SlackInteractionsHelpers';
import ProvidersController from '../RouteManagement/ProvidersController';
import tripsRouter from '../../new-slack/trips/trip-router';
import managerTripRouter from '../../new-slack/trips/manager/manager-trip-router';

const slackInteractionsRouter = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

slackInteractionsRouter.action({ callbackId: 'back_to_launch' },
  SlackInteractions.launch);
slackInteractionsRouter.action({ callbackId: 'book_new_trip' },
  SlackInteractionsHelpers.bookNewTrip);
slackInteractionsRouter.action({ callbackId: 'welcome_message' },
  SlackInteractionsHelpers.welcomeMessage);
slackInteractionsRouter.action({ callbackId: 'travel_trip_start' },
  SlackInteractions.bookTravelTripStart);
slackInteractionsRouter.action({ callbackId: /^travel_trip/ },
  SlackInteractions.handleTravelTripActions);
slackInteractionsRouter.action({ callbackId: /^schedule_trip/ },
  SlackInteractionsHelpers.handleUserInputs);
slackInteractionsRouter.action({ callbackId: 'itinerary_actions' },
  SlackInteractionsHelpers.handleItineraryActions);
slackInteractionsRouter.action({ callbackId: 'reschedule_trip' },
  SlackInteractionsHelpers.handleReschedule);
slackInteractionsRouter.action({ callbackId: 'approve_trip' },
  SlackInteractions.handleManagerApprovalDetails);
slackInteractionsRouter.action({ callbackId: 'manager_actions' },
  SlackInteractions.handleManagerActions);
slackInteractionsRouter.action({ callbackId: 'decline_trip' },
  SlackInteractions.handleTripDecline);
slackInteractionsRouter.action({ callbackId: 'trip_itinerary' },
  SlackInteractions.viewTripItineraryActions);
slackInteractionsRouter.action({ callbackId: /^operations_approval/ },
  SlackInteractionsHelpers.sendCommentDialog);
slackInteractionsRouter.action({ callbackId: 'operations_reason_dialog_trips' },
  SlackInteractions.handleTripActions);
slackInteractionsRouter.action({ callbackId: 'operations_reason_dialog_route' },
  OperationsHelper.sendOpsData);
slackInteractionsRouter.action({ callbackId: 'trips_cab_selection' },
  SlackInteractionsHelpers.handleOpsAction);
slackInteractionsRouter.action({ callbackId: 'provider_actions' },
  SlackInteractions.handleSelectCabActions);
slackInteractionsRouter.action({ callbackId: 'confirm_ops_approval' },
  TripCabController.handleSelectProviderDialogSubmission);
slackInteractionsRouter.action({ callbackId: 'tembea_route' },
  SlackInteractions.startRouteActions);
slackInteractionsRouter.action({ callbackId: 'providers_route_approval' },
  SlackInteractionsHelpers.startProviderActions);
slackInteractionsRouter.action({ callbackId: /^providers_approval/ },
  SlackInteractions.handleSelectCabAndDriverAction);
slackInteractionsRouter.action({ callbackId: /^new_route/ },
  SlackInteractions.handleRouteActions);
slackInteractionsRouter.action({ callbackId: /^manager_route/ },
  ManagerController.handleManagerActions);
slackInteractionsRouter.action({ callbackId: /^operations_route/ },
  OperationsHandler.handleOperationsActions);
slackInteractionsRouter.action({ callbackId: 'view_new_trip' },
  SlackInteractions.completeTripResponse);
slackInteractionsRouter.action({ callbackId: /^join_route/ },
  JoinRouteInteractions.handleJoinRouteActions);
slackInteractionsRouter.action({ callbackId: 'rate_trip' },
  RateTripController.rate);
slackInteractionsRouter.action({ callbackId: 'trip_completion' },
  TripInteractions.tripCompleted);
slackInteractionsRouter.action({ callbackId: 'trip_not_taken' },
  TripInteractions.reasonForNotTakingTrip);
slackInteractionsRouter.action({ callbackId: 'confirm_route_use' },
  JoinRouteInteractions.handleRouteBatchConfirmUse);
slackInteractionsRouter.action({ callbackId: 'route_skipped' },
  JoinRouteInteractions.handleRouteSkipped);
slackInteractionsRouter.action({ callbackId: 'rate_route' },
  RateTripController.rate);
slackInteractionsRouter.action({ callbackId: 'reassign_driver' },
  ProvidersController.providerReassignDriver);

// PLEASE DO NOT TOUCH EXCEPT YOUR NAME IS ADAEZE, BARAK OR RENE

managerTripRouter(slackInteractionsRouter);

// PLEASE DO NOT TOUCH EXCEPT YOUR NAME IS ADAEZE, BARAK OR RENE
tripsRouter(slackInteractionsRouter);

export default slackInteractionsRouter;
