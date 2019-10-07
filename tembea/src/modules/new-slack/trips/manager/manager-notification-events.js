import TeamDetailsService from '../../../../services/TeamDetailsService';
import DepartmentService from '../../../../services/DepartmentService';
import ManagerTripHelper from './manager-trip-helpers';
import SlackNotifications from '../../notifications';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';
import CleanData from '../../../../helpers/cleanData';
import WebClientSingleton from '../../../../utils/WebClientSingleton';
import { Block } from '../../models/slack-block-models';

const web = new WebClientSingleton();

export default class ManagerNotificationEvents {
  static async sendOperationsTripRequestNotification(trip, data, respond, type = 'regular') {
    console.log(' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ');
    try {
      const payload = CleanData.trim(data);
      const tripInformation = trip;
      const { botToken: slackBotOauthToken, opsChannelId } = await TeamDetailsService.getTeamDetails(payload.team.id);
      const checkTripType = type === 'regular';
      const { name } = await DepartmentService
        .getById(tripInformation.departmentId);
      tripInformation.department = name;
      if (checkTripType) {
        ManagerNotificationEvents.sendRequesterApprovedNotification(
          tripInformation, respond, slackBotOauthToken
        );
      }
      tripInformation.pickup = tripInformation.origin;
      const opsRequestMessage = ManagerTripHelper.getRequestMessageForOperationsChannel(
        tripInformation, payload, opsChannelId, type
      );
      await SlackNotifications.sendNotification(opsRequestMessage, slackBotOauthToken);
    } catch (error) {
      BugsnagHelper.log(error);
      const errorBlock = new Block().addText(
        'An error occurred while processing your request. '
        + 'Please contact the administrator.'
      );
      respond(new BlockMessage([errorBlock]));
    }
  }
  static async   sendRequesterApprovedNotification(data, respond, slackBotOauthToken) {
    try {
      const responseData = CleanData.trim(data);
      const dept = await DepartmentService.getById(
        responseData.departmentId
      );

      if (!dept) return;

      const { head: { name } } = dept;

      Object.assign(responseData, { department: name });

      const imResponse = await web.getWebClient(slackBotOauthToken)
        .im
        .open({
          user: responseData.requester.slackId
        });
      const response = await ManagerTripHelper.responseForRequester(
        responseData,
        imResponse.channel.id
      );
      SlackNotifications.sendNotification(response, slackBotOauthToken);
    } catch (error) {
      BugsnagHelper.log(error);
      const errorBlock = new Block().addText('Oops! We could not process this request.');
      respond(new BlockMessage([errorBlock]));
    }
  }
  static async responseForOperations(data, actions, channelId, callbackId, payload, tripType) {
    const { tripStatus } = data;
    const color = tripStatus && tripStatus
      .toLowerCase().startsWith('ca') ? 'good' : undefined;

    if (tripType === 'regular') {
      return ManagerTripHelper.prepareOperationsDepartmentResponse(
        channelId, data, color, actions, callbackId, payload
      );
    }

    return ManagerTripHelper.travelOperationsDepartmentResponse(
      channelId, data, color, actions, callbackId
    );
  }

};
