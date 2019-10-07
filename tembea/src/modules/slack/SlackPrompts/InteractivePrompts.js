import {
  SlackInteractiveMessage, SlackSelectActionWithSlackContent,
  SlackAttachment, SlackButtonAction, SlackCancelButtonAction,
  SlackButtonsAttachmentFromAList, SlackSelectAction
} from '../SlackModels/SlackMessageModels';
import Notifications from './Notifications';
import WebClientSingleton from '../../../utils/WebClientSingleton';
import createNavButtons from '../../../helpers/slack/navButtons';
import SlackPagination from '../../../helpers/slack/SlackPaginationHelper';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import InteractivePromptsHelpers from '../helpers/slackHelpers/InteractivePromptsHelpers';
import previewTripDetailsAttachment
  from '../helpers/slackHelpers/TravelTripHelper/previewTripDetailsAttachment';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import DepartmentService from '../../../services/DepartmentService';
import PreviewScheduleTrip from '../helpers/slackHelpers/previewScheduleTripAttachments';
import InteractivePromptSlackHelper from '../helpers/slackHelpers/InteractivePromptSlackHelper';

const web = new WebClientSingleton();

class InteractivePrompts {
  static sendBookNewTripResponse(payload, respond) {
    const attachment = new SlackAttachment();
    attachment.addFieldsOrActions('actions', [
      new SlackButtonAction('yes', 'For Me', 'true'),
      new SlackButtonAction('no', 'For Someone', 'false')
    ]);
    attachment.addOptionalProps('book_new_trip');
    const navAttachment = createNavButtons('back_to_launch', 'back_to_launch');
    const message = new SlackInteractiveMessage('Who are you booking for?', [
      attachment, navAttachment
    ]);
    respond(message);
  }

  static sendTripItinerary(payload, respond) {
    const attachment = new SlackAttachment();
    attachment.addFieldsOrActions('actions', [
      new SlackButtonAction('history', 'Trip History', 'view_trips_history'),
      new SlackButtonAction(
        'upcoming',
        'Upcoming Trips ',
        'view_upcoming_trips'
      )
    ]);
    attachment.addOptionalProps('trip_itinerary', 'fallback', '#FFCCAA', 'default');
    const navAttachment = createNavButtons('back_to_launch', 'back_to_launch');
    const message = new SlackInteractiveMessage('Please choose an option', [
      attachment, navAttachment
    ]);
    respond(message);
  }

  static async sendUpcomingTrips(trips, totalPages, pageNumber, payload, respond) {
    const attachments = [];

    trips.forEach(
      trip => InteractivePromptSlackHelper.formatUpcomingTrip(trip, payload, attachments)
    );

    let pageButtonsAttachment;
    if (totalPages > 1) {
      pageButtonsAttachment = SlackPagination.createPaginationAttachment(
        'trip_itinerary', 'view_upcoming_trips', pageNumber, totalPages
      );
    }
    const navButtonsAttachment = createNavButtons('welcome_message', 'view_trips_itinerary');
    const message = new SlackInteractiveMessage(
      'Your Upcoming Trips', [...attachments, pageButtonsAttachment, navButtonsAttachment]
    );
    respond(message);
  }

  /**
   * @description Replaces the trip notification message with an approval or decline message
   * @param  {boolean} decline Is this a decline or approval?
   * @param  {Object} tripInformation The object containing all the trip information
   * @param  {string} timeStamp The timestamp of the trip request notification
   * @param  {string} channel The channel id to which the notification was sent
   * @param {string} slackBotOauthToken The team bot token
   */
  static async sendManagerDeclineOrApprovalCompletion(
    decline, tripInformation, timeStamp, channel, slackBotOauthToken
  ) {
    const { requester } = tripInformation;
    const attachments = [
      new SlackAttachment(decline ? 'Trip Declined' : 'Trip Approved'),
      new SlackAttachment(
        decline
          ? ':x: You have declined this trip'
          : ':white_check_mark: You have approved this trip'
      )
    ];
    const fields = Notifications.notificationFields(tripInformation);

    attachments[0].addOptionalProps('callback');
    attachments[1].addOptionalProps('callback');
    attachments[0].addFieldsOrActions('fields', fields);

    await InteractivePrompts.messageUpdate(
      channel,
      (decline
        ? `You have just declined the trip from <@${requester.slackId}>`
        : `You have just approved the trip from <@${requester.slackId}>`),
      timeStamp,
      attachments,
      slackBotOauthToken
    );
  }

  /**
   * @description Update a previously sent message
   * @param  {string} channel The channel to which the original message was sent
   * @param  {string} text The message text
   * @param  {string} timeStamp The time stamp of the original message
   * @param  {array} attachments The attachments
   * @param {string} slackBotOauthToken The team bot token
   */
  static async messageUpdate(channel, text, timeStamp, attachments, slackBotOauthToken) {
    await web.getWebClient(slackBotOauthToken).chat.update({
      channel,
      text,
      ts: timeStamp,
      attachments
    });
  }

  /**
   * @description Replaces the trip notification on the ops channel with an approval or decline
   * @param  {boolean} decline
   * @param  {Object} tripInformation
   * @param  {string} timeStamp
   * @param  {string} channel
   * @param  {string} slackBotOauthToken
   */
  static async sendOpsDeclineOrApprovalCompletion(
    decline, tripInformation, timeStamp, channel, slackBotOauthToken
  ) {
    const tripDetailsAttachment = new SlackAttachment(decline ? 'Trip Declined' : 'Trip Confirmed');
    const confirmationDetailsAttachment = new SlackAttachment(
      decline
        ? `:X: <@${tripInformation.decliner.slackId}> declined this request`
        : `:white_check_mark: <@${tripInformation.confirmer.slackId}> approved this request`
    );

    confirmationDetailsAttachment.addOptionalProps('', '', (decline ? 'danger' : 'good'));
    tripDetailsAttachment.addOptionalProps('', '', '#3c58d7');
    tripDetailsAttachment.addFieldsOrActions('fields',
      InteractivePromptsHelpers.addOpsNotificationTripFields(tripInformation));

    try {
      await InteractivePrompts.messageUpdate(channel,
        (decline ? 'Trip request declined.' : 'Trip request approved'),
        timeStamp,
        [tripDetailsAttachment, confirmationDetailsAttachment],
        slackBotOauthToken);
    } catch (err) {
      BugsnagHelper.log(err);
    }
  }

  static sendTripHistory(trips, totalPages, pageNumber, payload, respond) {
    const attachments = InteractivePromptsHelpers.formatTripHistory(trips);
    const text = '*Your trip history for the last 30 days*';
    const navButtonsAttachment = createNavButtons(
      'welcome_message', 'view_trips_itinerary'
    );

    let pageButtonsAttachment;
    if (totalPages > 1) {
      pageButtonsAttachment = SlackPagination.createPaginationAttachment(
        'trip_itinerary', 'view_trips_history', pageNumber, totalPages
      );
    }

    const message = new SlackInteractiveMessage(text,
      [...attachments, pageButtonsAttachment, navButtonsAttachment]);
    respond(message);
  }

  static sendRiderSelectList(payload, respond) {
    const attachments = new SlackAttachment();

    attachments.addFieldsOrActions('actions', [
      new SlackSelectActionWithSlackContent('rider', 'Select a passenger')
    ]);
    attachments.addOptionalProps('schedule_trip_rider');
    // add navigation buttons
    const navAttachment = createNavButtons('welcome_message', 'book_new_trip');

    const message = new SlackInteractiveMessage(
      'Who are you booking the ride for?', [attachments, navAttachment],
      payload.channel.id, payload.user.id
    );
    respond(message);
  }

  /**
   * @static async sendListOfDepartments
   * @param {object} {
   *     @param payload - payload from slack sdk,
   *     @param respond - respond function from slack sdk,
   *     @param attachmentCallbackId,
   *     @param navButtonCallbackId,
   *     @param navButtonValue
   *   }
   * @param {string} [forSelf='true'] - either 'true' or 'false'
   * @memberof InteractivePrompts
   */
  static async sendListOfDepartments(
    {
      payload, respond,
      attachmentCallbackId, navButtonCallbackId, navButtonValue
    },
    forSelf = 'true'
  ) {
    const personify = forSelf === 'true' ? 'your' : "passenger's";
    const attachment = SlackButtonsAttachmentFromAList.createAttachments(
      await DepartmentService.getDepartmentsForSlack(payload.team.id),
      attachmentCallbackId
    );
    attachment.push(createNavButtons(navButtonCallbackId, navButtonValue));

    const message = new SlackInteractiveMessage(
      `*Please select ${personify} department.*`,
      attachment, payload.channel.id, payload.user.id
    );
    respond(message);
  }

  static sendAddPassengersResponse(respond, forSelf = 'true') {
    const attachment = new SlackAttachment();
    const passengerNumbers = SlackHelpers.noOfPassengers();

    attachment.addFieldsOrActions('actions', [
      new SlackSelectAction('addPassenger', 'No. of passengers', passengerNumbers),
      new SlackButtonAction('no', 'No', 1)]);

    attachment.addOptionalProps('schedule_trip_addPassengers');

    /* if rider is self navigate to for me/for someone option when 'Back' is clicked,
       else navigate to 'select rider' option
    */
    const navAttachment = createNavButtons(forSelf === 'true'
      ? 'welcome_message' : 'schedule_trip_reason', 'book_new_trip');

    const message = new SlackInteractiveMessage(
      'Any more passengers?', [attachment, navAttachment]
    );
    respond(message);
  }

  static sendSelectDestination(respond) {
    const attachment = new SlackAttachment();
    attachment.addFieldsOrActions('actions', [
      new SlackButtonAction('selectDestination', 'Destination', 'true'),
    ]);
    const navAttachment = createNavButtons('schedule_trip_addPassengers', 'called_back_button');

    attachment.addOptionalProps('schedule_trip_destinationSelection');
    const message = new SlackInteractiveMessage('*Select Destination*', [
      attachment, navAttachment
    ]);
    respond(message);
  }

  static sendPreviewTripResponse(tripDetails, respond) {
    const hoursBefore = tripDetails.tripType === 'Airport Transfer' ? 3 : 2;
    const tripType = tripDetails.tripType === 'Airport Transfer' ? 'flight' : 'appointment';
    const attachment = new SlackAttachment(
      '',
      `N.B. Pickup time is fixed at ${hoursBefore}hrs before ${tripType} time`,
      '', '', '', 'default', 'warning'
    );
    const fields = previewTripDetailsAttachment(tripDetails);

    const actions = [
      new SlackButtonAction('confirmTripRequest', 'Confirm Trip Request', 'confirm'),
      new SlackButtonAction('Add Trip Note', tripDetails.tripNote ? 'Update Trip Note'
        : 'Add Trip Note', 'trip_note'),
      new SlackCancelButtonAction(
        'Cancel Trip Request',
        'cancel',
        'Are you sure you want to cancel this trip request',
        'cancel_request'
      ),

    ];

    attachment.addFieldsOrActions('actions', actions);
    attachment.addFieldsOrActions('fields', fields);
    attachment.addOptionalProps('travel_trip_confirmation', 'fallback', undefined, 'default');

    const message = new SlackInteractiveMessage('*Trip request preview*', [
      attachment]);
    respond(message);
  }

  static async sendScheduleTripResponse(tripDetails, respond) {
    const fields = await PreviewScheduleTrip.previewScheduleTripAttachments(tripDetails);
    const attachment = new SlackAttachment(
      '',
      'Trip Summary',
      '', '', '', 'default', 'info'
    );

    const actions = [
      new SlackButtonAction('confirmTripRequest', 'Confirm Trip', 'confirm'),
      new SlackCancelButtonAction(
        'Cancel Trip',
        'cancel',
        'Are you sure you want to cancel this schedule trip',
        'cancel_request'
      )
    ];
    const message = new SlackInteractiveMessage('*Trip request preview*', [
      attachment
    ]);
    attachment.addFieldsOrActions('actions', actions);
    attachment.addFieldsOrActions('fields', fields);
    attachment.addOptionalProps('schedule_trip_confirmation', 'fallback', undefined, 'default');
    respond(message);
  }
}

export default InteractivePrompts;
