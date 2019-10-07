import ManagerTripHelper from './manager-trip-helpers';
import { Block, BlockMessage, SlackText, TextTypes } from '../../models/slack-block-models';
import CleanData from '../../../../helpers/cleanData';
import BugsnagHelper from '../../../../helpers/bugsnagHelper';
import NewSlackHelpers from '../../helpers/slack-helpers';
import tripService from '../../../../services/TripService';
import { SlackEvents, slackEventNames } from '../../events/slackEvents';
import TeamDetailsService from '../../../../services/TeamDetailsService';

export default class ManagerTripController {
  static async handleManagerActions(data, respond) {
    const payload = CleanData.trim(data);
    const { text, value } = payload.actions[0];
    const isCancelled = await ManagerTripHelper.handleCancellation(value);
    // Notify manager if trip has been cancelled
    if (isCancelled) {
      const cancelBlock = new Block().addText('The trip request has already been cancelled.');
      respond(new BlockMessage([cancelBlock]));
      return;
    }
    try {
      if (text.text === 'Approve') {
        return ManagerTripHelper.managerApprove(payload, respond);
      }
      return ManagerTripHelper.managerDecline(payload, respond);
    } catch (error) {
      BugsnagHelper.log(error);
      const errorBlock = new Block().addText('Error:bangbang:: I was unable to do that.');
      respond(new BlockMessage([errorBlock]));
    }
  }

  static async handleManagerApprovalDetails(data, respond) {
    try {
      const payload = CleanData.trim(data);
      const { submission: { approveReason }, user, team: { id: teamId }, response_url } = payload;
      const state = payload.state.split(' ');
      const [, , tripId] = state;
      const errors = await ManagerTripHelper.runValidation({ approveReason });
      if (errors.length > 0) { return { errors }; }
      const hasApproved = await NewSlackHelpers.approveRequest(tripId, user.id, approveReason);
      if (hasApproved) {
        const trip = await tripService.getById(tripId);
        SlackEvents.raise(slackEventNames.TRIP_APPROVED, trip, payload, respond);
        trip.response_url = response_url;
        ManagerTripHelper.sendManagerDeclineOrApprovalCompletion(
          false, trip
        );
        return;
      }
      let responseBlock = new Block().addText(new SlackText('Error:bangbang: : '
        + 'This request could not be approved. Consult the administrator', TextTypes.markdown))
      respond([responseBlock]);
    } catch (error) {
      console.log('error :', error);
      let errorBlock = new Block().addText(new SlackText('Error:bangbang: : '
        + 'We could not complete this process please try again.', TextTypes.markdown))
      bugsnagHelper.log(error);
      respond(errorBlock);
    }
  }
}
