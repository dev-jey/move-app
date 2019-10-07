import {
  Block, BlockTypes, BlockMessage, ButtonElement, SlackText, TextTypes
} from '../../models/slack-block-models';
import Services from '../../../../services/UserService';
import managerTripBlocks from './blocks';
import NewSlackHelpers from '../../helpers/slack-helpers';
import managerTripActions from './actions';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import { getSlackDateString } from '../../../slack/helpers/dateHelpers';
import tripService from '../../../../services/TripService';
import CleanData from '../../../../helpers/cleanData';
import ManagerTripInteractions from './manager-interactions';
import DialogPrompts from '../../interactions/DialogPrompts';
import { ManagerNotificationEvents } from './manager-notification-events';
import { SlackDialogError } from '../../models/slack-dialog-models';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';

export default class ManagerTripHelper {
  static async getManagerMessageAttachment(newTripRequest,
    imResponse, requester, requestType, rider) {
    const { tripStatus } = newTripRequest;
    const text = requestType === 'newTrip' ? 'booked a' : 'rescheduled this';
    const titleBlock = new Block().addText(new SlackText('*Trip Request*', TextTypes.markdown));
    await Services.findOrCreateNewUserWithSlackId(rider);
    let fields = null;
    fields = ManagerTripHelper.notificationFields(newTripRequest);
    const managerFieldsBlock = new Block(BlockTypes.section);
    managerFieldsBlock.addFields(fields);
    const managerActionsBlock = new Block(BlockTypes.actions, managerTripBlocks.managerActionsBlock);
    if (tripStatus === 'Pending') {
      const actions = ManagerTripHelper.notificationActions(newTripRequest);
      managerActionsBlock.addElements(actions);
    }
    const titleMessage = await ManagerTripHelper.getMessage(rider.slackId, requester.slackId, text);
    const blockMessage = [titleBlock, managerFieldsBlock, managerActionsBlock];
    return NewSlackHelpers.createDirectMessage(imResponse, titleMessage, blockMessage);
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
    decline, tripInformation
  ) {
    const { response_url } = tripInformation;
    const tripHeading = [
      new SlackText(decline ? 'Trip Declined' : 'Trip Approved'),
      new SlackText(
        decline
          ? ':x: You have declined this trip'
          : ':white_check_mark: You have approved this trip', TextTypes.markdown
      )
    ];
    let fields = null;
    fields = ManagerTripHelper.notificationFields(tripInformation);
    const tripBlock = new Block(BlockTypes.section);
    tripBlock.addFields(fields);
    const message = new BlockMessage([tripBlock]);
    await UpdateSlackMessageHelper.newUpdateMessage(response_url, message);
  }
  static notificationActions(tripInformation) {
    return [
      new ButtonElement('Approve', `${tripInformation.id}`,
        managerTripActions.managerApprove,
        SlackActionButtonStyles.primary),
      new ButtonElement('Decline', `${tripInformation.id}`,
        managerTripActions.managerDecline,
        SlackActionButtonStyles.danger)
    ];
  }

  static notificationFields(tripInformation) {
    const {
      origin: { address: pickup },
      destination: { address: destination },
      rider: { name: passenger, phoneNo: riderPhoneNumber },
      createdAt,
      departureTime,
      reason,
      tripNote,
      noOfPassengers,
      driver,
      cab
    } = tripInformation;

    const userAttachment = ManagerTripHelper.cabDriverDetailsNotification(cab, driver, departureTime, destination, pickup);
    return (!(cab && driver)) ? [
      new SlackText(`*Pickup Location* \n${pickup}`, TextTypes.markdown),
      new SlackText(`*Destination* \n${destination}`, TextTypes.markdown),
      new SlackText(`*Request Date* \n${getSlackDateString(createdAt)}`, TextTypes.markdown),
      new SlackText(`*Trip Date* \n${getSlackDateString(departureTime)}`, TextTypes.markdown),
      new SlackText(`*Reason* \n${reason}`, TextTypes.markdown),
      new SlackText(`*No of Passengers* \n${noOfPassengers}`, TextTypes.markdown),
      new SlackText(`*Passenger* \n${passenger}`, TextTypes.markdown),
      new SlackText(`*Passenger* Phone No. \n${riderPhoneNumber || 'N/A'}`, TextTypes.markdown),
      new SlackText(`*Trip Notes* \n${tripNote || 'N/A'}`, TextTypes.markdown),
    ] : userAttachment;
  }

  static async getMessage(riderId, requesterId, text) {
    const smiley = text === 'cancelled this' ? '' : ' :smiley:';
    if (requesterId === riderId) {
      return `Hey, <@${requesterId}> has just ${text} trip.${smiley}`;
    }
    return `Hey, <@${requesterId}> has just ${text} trip for <@${
      riderId}>.${smiley}`;
  }

  /**
 *
 * @description contains the message attachement that is sent to the rider after a successfully trip request.
 * @static
 * @param {object} cab - The cab information
 * @param {object} driver - The driver's information
 * @param {*} departureTime - The trip's departure trip.
 * @param {*} destination - The trip destination
 * @param {} pickup
 * @returns userAttachement
 * @memberof SlackNotifications
 */
  static cabDriverDetailsNotification(cab, driver, departureTime, destination, pickup) {
    let userAttachment = [];
    if (cab && driver) {
      const { driverName, driverPhoneNo } = driver;
      const { model, regNumber } = cab;
      userAttachment = [
        new SlackText(`*Pickup Location* \n${pickup}`, TextTypes.markdown),
        new SlackText(`*Destination* \n${destination}`, TextTypes.markdown),
        new SlackText(`*Driver Name* \n${driverName}`, TextTypes.markdown),
        new SlackText(`*Trip Date* \n${getSlackDateString(departureTime)}`, TextTypes.markdown),
        new SlackText(`*Driver Contact* \n${driverPhoneNo}`, TextTypes.markdown),
        new SlackText(`*Vehicle Name* \n${model}`, TextTypes.markdown),
        new SlackText(`*Vehicle Reg Number* \n${regNumber}`, TextTypes.markdown)
      ];
    } else {
      return;
    }
    return userAttachment;
  }

  static async handleCancellation(tripRequestId) {
    const { tripStatus } = await tripService.getById(tripRequestId);
    return tripStatus === 'Cancelled';
  }

  static async managerDecline(payload) {
    const { value } = payload.actions[0];
    ManagerTripInteractions.sendReasonDialog(payload,
      managerTripActions.managerReasonDecline,
      `${payload.message.ts} ${payload.channel.id} ${value}`,
      'Decline', 'Decline', 'declineReason');
  }

  static async managerApprove(payload, respond) {
    const { value } = payload.actions[0];
    const trip = await NewSlackHelpers.isRequestApproved(value, payload.user.id);
    ManagerTripHelper.approveTripRequestByManager(payload, trip, respond);
  }

  static approveTripRequestByManager(data, trip, respond) {
    const payload = CleanData.trim(data);
    const { channel, actions } = payload;
    if (trip.isApproved) {
      const approvedBlock = new Block().addText(`This trip has already been approved by ${trip.approvedBy}`);
      respond(new BlockMessage(
        approvedBlock
      ));
      return;
    }
    return ManagerTripInteractions.sendReasonDialog(payload,
      managerTripActions.managerReasonApprove,
      `${payload.message.ts} ${channel.id} ${actions[0].value}`,
      'Approve', 'Approve', 'approveReason');
  }

  static runValidation(reasonObject) {
    const [field, reason] = Object.entries(reasonObject)[0];
    const errors = [];
    if (reason.trim() === '') {
      errors.push(new SlackDialogError(field,
        'This field cannot be empty'));
    }
    if (reason.trim().length > 100) {
      errors.push(new SlackDialogError(field,
        'Character length must be less than or equal to 100'));
    }
    return errors;
  }

  static getRequestMessageForOperationsChannel(data, payload, channel, tripType) {
    const channelId = channel;
    const { id } = data;

    const actions = [
      new SlackButtonAction('confirmTrip', 'Confirm', id),
      new SlackButtonAction('declineRequest', 'Decline', id, 'danger')
    ];
    return ManagerNotificationEvents.responseForOperations(
      data, actions, channelId, 'trips_cab_selection', payload, tripType
    );
  }

  static async responseForRequester(data, slackChannelId) {
    const {
      department, pickup, destination, createdAt: requestDate,
      departureTime, tripStatus, managerComment
    } = data;

    const detailedAttachment = new SlackAttachment(
      'Approved',
      await ManagerTripHelper.getMessageHeader(data), null, null, null, 'default', '#29b016'
    );

    const attachments = ManagerTripHelper.getRequesterAttachment(
      department, data, slackChannelId, pickup, destination,
      requestDate, departureTime, tripStatus, managerComment
    );
    attachments.unshift(detailedAttachment);

    return new SlackInteractiveMessage(undefined, attachments, slackChannelId);
  }


  static async getMessageHeader(trip) {
    const { pickup, destination } = trip;

    const isApproved = await NewSlackHelpers.isRequestApproved(trip.id);

    return `Your request from *${pickup.address}* to *${destination.address
      }* has been approved by ${isApproved.approvedBy
      }. The request has now been forwarded to the operations team for confirmation.`;
  }

  static getRequesterAttachment(
    department, data, slackChannelId, pickup, destination,
    requestDate, departureDate, tripStatus, managerComment
  ) {
    const detailedAttachment = new SlackAttachment(
      '*Trip Details*', null, null, null, null, 'default', '#29b016'
    );

    const fields = [
      new SlackAttachmentField('Pickup', pickup.address, true),
      new SlackAttachmentField('Destination', destination.address, true),
      new SlackAttachmentField('Request Date', getSlackDateString(requestDate), true),
      new SlackAttachmentField('Departure Date', getSlackDateString(departureDate), true),
      new SlackAttachmentField('Trip Status', tripStatus, true),
      new SlackAttachmentField('Reason', managerComment, true)
    ];
    detailedAttachment.addFieldsOrActions('fields', fields);

    return [detailedAttachment];
  }

  static prepareOperationsDepartmentResponse(
    channelId, responseData, color, actions, callbackId, payload
  ) {
    const {
      tripStatus, requester, pickup, departureTime,
      rider, destination, managerComment, department
    } = responseData;

    const riderInfo = this.riderInfoResponse(rider, requester);

    const detailedAttachment = new SlackAttachment(
      'Manager approved trip request', riderInfo, null, null, null, 'default', color
    );
    const fields = [
      new SlackAttachmentField('Passenger', `<@${rider.slackId}>`, true),
      new SlackAttachmentField('Department', `<@${department}>`, true),
      new SlackAttachmentField('Pickup Location', pickup.address, true),
      new SlackAttachmentField('Destination', destination.address, true),
      new SlackAttachmentField('Departure', getSlackDateString(departureTime), true),
      new SlackAttachmentField('Status', tripStatus, true),
      new SlackAttachmentField('Manager Comment', managerComment)
    ];

    detailedAttachment.addFieldsOrActions('actions', actions);
    detailedAttachment.addFieldsOrActions('fields', fields);
    detailedAttachment.addOptionalProps(callbackId, 'fallback', undefined, 'default');

    return new SlackInteractiveMessage(
      `<@${payload.user.id}> just approved this trip. Its ready for your action :smiley:`,
      [detailedAttachment], channelId
    );
  }

  static riderInfoResponse(rider, requester) {
    const riderInfo = rider.slackId !== requester.slackId
      ? `<@${requester.slackId}> requested a trip for <@${rider.slackId}>`
      : `<@${requester.slackId}> requested a trip`;
    return riderInfo;
  }

  static travelOperationsDepartmentResponse(
    channelId, responseData, color, actions, callbackId
  ) {
    const {
      tripStatus, requester, pickup, departureTime, rider, destination,
      department, noOfPassengers, tripType, tripNote
    } = responseData;
    const riderInfo = this.riderInfoResponse(rider, requester);

    const detailedAttachment = new SlackAttachment(
      'Travel trip request', riderInfo, null, null, null, 'default', color
    );
    const fields = [
      new SlackAttachmentField('Passenger', `<@${rider.slackId}>`, true),
      new SlackAttachmentField('Department', department, true),
      new SlackAttachmentField('Pickup Location', pickup.address, true),
      new SlackAttachmentField('Destination', destination.address, true),
      new SlackAttachmentField('Pick-Up Time', getSlackDateString(departureTime), true),
      new SlackAttachmentField('Number of Passengers', noOfPassengers, true),
      new SlackAttachmentField('Trip Type', tripType, true),
      new SlackAttachmentField('Status', tripStatus, true),
      new SlackAttachmentField('Trip Notes', !tripNote ? 'No Trip Notes' : tripNote, true),
    ];
    detailedAttachment.addFieldsOrActions('actions', actions);
    detailedAttachment.addFieldsOrActions('fields', fields);
    detailedAttachment.addOptionalProps(callbackId, '', undefined, 'default');

    return new SlackInteractiveMessage(
      '', [detailedAttachment], channelId
    );
  }

}
