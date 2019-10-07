import LocationMapHelpers from '../../../../../helpers/googleMaps/locationsMapHelpers';
import TravelTripHelper, { getTravelKey } from './index';
import GoogleMapsError from '../../../../../helpers/googleMaps/googleMapsError';
import {
  SlackInteractiveMessage,
  SlackAttachment,
  SlackButtonAction
} from '../../../SlackModels/SlackMessageModels';
import Notifications from '../../../SlackPrompts/Notifications';
import InteractivePromptSlackHelper from '../InteractivePromptSlackHelper';
import {
  LocationPrompts, Cache, InteractivePrompts, DialogPrompts
} from '../../../RouteManagement/rootFile';
import Validators from '../../../../../helpers/slack/UserInputValidator/Validators';

export default class travelHelper {
  static async getPickupType(data) {
    const { pickup } = data;
    if (pickup !== 'Others') {
      return InteractivePromptSlackHelper.openDestinationDialog();
    }
    const verifiable = await LocationMapHelpers
      .locationVerify(data, 'pickup', 'travel_trip');
    return verifiable;
  }

  static async getDestinationType(payload, respond) {
    const { submission: { destination } } = payload;
    if (destination !== 'Others') {
      const confirmDetails = await TravelTripHelper.detailsConfirmation(payload, respond);
      return confirmDetails;
    }
    try {
      const verifiable = await LocationMapHelpers
        .locationVerify(payload.submission, 'destination', 'travel_trip');
      if (verifiable) respond(verifiable);
    } catch (err) {
      if (err instanceof GoogleMapsError && err.code === GoogleMapsError.UNAUTHENTICATED) {
        const confirmDetails = await TravelTripHelper.detailsConfirmation(payload, respond);
        respond(confirmDetails);
      }
    }
  }

  static validatePickupDestination(payload, respond) {
    const {
      pickup, teamID, userID, rider
    } = payload;

    const location = (pickup === 'To Be Decided') ? 'pickup' : 'destination';
    Notifications.sendRiderlocationConfirmNotification({
      location, teamID, userID, rider
    }, respond);

    const message = travelHelper.responseMessage(
      `Travel ${location} confirmation request.`,
      `A request has been sent to <@${rider}> to confirm his ${location} location.`,
      'Once confirmed, you will be notified promptly :smiley:',
      'confirm'
    );
    respond(message);
  }

  static responseMessage(messageTitle, messageTitleBody, messageBody, btnValue = 'confirm') {
    const attachment = new SlackAttachment(
      messageTitleBody,
      messageBody,
      '', '', '', 'default', 'warning'
    );

    const actions = [
      new SlackButtonAction('confirmTripRequest', 'Okay', btnValue),
    ];

    attachment.addFieldsOrActions('actions', actions);
    attachment.addOptionalProps('travel_trip_requesterToBeDecidedNotification',
      'fallback', undefined, 'default');

    const message = new SlackInteractiveMessage(messageTitle,
      [attachment]);
    return message;
  }

  static locationNotFound(payload, respond) {
    const value = payload.actions[0].name;
    if (value === 'no') { LocationPrompts.errorPromptMessage(respond); }
  }
  
  static async riderLocationConfirmation(payload, respond) {
    const valueName = payload.actions[0].value;
    if (valueName === 'cancel') {
      respond(new SlackInteractiveMessage('Thank you for using Tembea'));
    } else {
      const location = valueName.split('_')[0];
      await LocationMapHelpers.callRiderLocationConfirmation(
        payload, respond, location
      );
      respond(new SlackInteractiveMessage('noted...'));
    }
  }

  static updateLocationInfo(tripDetails, confirmedLocation) {
    let location;
    const updatedTripDetails = { ...tripDetails };
    if (updatedTripDetails.pickup === 'To Be Decided') {
      updatedTripDetails.pickup = confirmedLocation;
      location = 'Pickup';
    } else {
      updatedTripDetails.destination = confirmedLocation;
      location = 'Destination';
    }

    return { updatedTripDetails, location };
  }

  static async tripNotesAddition(payload, respond) {
    const { user: { id }, submission: { tripNote } } = payload;
    const { tripDetails } = await Cache.fetch(getTravelKey(id));
    const errors = [];
    errors.push(...Validators.validateDialogSubmission(payload));
    if (errors.length) return { errors };
    tripDetails.tripNote = tripNote;
    await Cache.save(getTravelKey(id), 'tripDetails', tripDetails);
    return InteractivePrompts.sendPreviewTripResponse(tripDetails, respond);
  }

  static async notesRequest(payload, respond) {
    const { user: { id } } = payload;
    const { tripDetails: { tripNote } } = await Cache.fetch(getTravelKey(id));
    respond(new SlackInteractiveMessage('Noted ...'));
    return DialogPrompts.sendTripNotesDialogForm(payload,
      'travelTripNoteForm', 'travel_trip_tripNotesAddition',
      'Add Trip Notes', tripNote || null);
  }

  static async riderRequest(payload, tripDetails, respond) {
    const { team: { id: teamID }, user: { id: userID } } = payload;
    const { pickup, destination, rider } = tripDetails;
    await Cache.save(getTravelKey(rider), 'waitingRequester', userID);
    const data = {
      pickup, destination, teamID, userID, rider
    };
    await travelHelper.validatePickupDestination(data, respond);
  }
}
