import {
  Block, BlockMessage
} from '../../models/slack-block-models';
import UserTripHelpers, { userTripActions } from './user-trip-helpers';
import {
  SlackInteractiveMessage
} from '../../../slack/SlackModels/SlackMessageModels';
import SlackController from '../../../slack/SlackController';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import { getTripKey } from '../../../../helpers/slack/ScheduleTripInputHandlers';
import Cache from '../../../../cache';
import Interactions from './interactions';
import NewSlackHelpers from '../../helpers/slack-helpers';

export default class UserTripBookingController {
  static startTripBooking(payload, respond) {
    const message = UserTripHelpers.createStartMessage();
    respond(message);
  }

  static async forMe(payload, respond) {
    const forMe = payload.actions[0].action_id === userTripActions.forMe;
    await Cache.save(getTripKey(payload.user.id), 'forMe', forMe);
    if (forMe) {
      const state = { origin: payload.response_url };
      await Interactions.sendTripReasonForm(payload, state);
    } else {
      const message = UserTripHelpers.getRiderSelectMessage();
      respond(message);
    }
  }

  static async saveRider(payload) {
    const rider = payload.actions[0].selected_user;
    await Cache.save(getTripKey(payload.user.id), 'rider', rider);
    const state = { origin: payload.response_url };
    await Interactions.sendTripReasonForm(payload, state);
  }

  static async handleReasonSubmit(payload) {
    if (payload.submission) {
      const result = await UserTripHelpers.setReason(
        payload.user.id, payload.submission
      );
      if (result && result.errors) return result;
    }
    await UserTripHelpers.sendAddPassengers(payload.state);
  }

  static async saveExtraPassengers(payload, respond) {
    const noOfPassengers = payload.actions[0].value
      ? payload.actions[0].value : payload.actions[0].selected_option.value;
    await Cache.save(getTripKey(payload.user.id), 'passengers', noOfPassengers);
    const message = await UserTripHelpers.getDepartmentListMessage(payload);
    respond(message);
  }

  static async saveDepartment(payload) {
    const departmentId = payload.actions[0].value;
    await Cache.save(getTripKey(payload.user.id), 'departmentId', departmentId);
    const state = { origin: payload.response_url };
    const fields = await NewSlackHelpers.getPickupFields();
    await Interactions.sendDetailsForm(payload, state, {
      title: 'Pickup Details',
      submitLabel: 'Submit',
      callbackId: userTripActions.pickupDialog,
      fields
    });
  }

  static async savePickupDetails(payload) {
    if (payload.submission) {
      const result = await UserTripHelpers.handlePickUpDetails(payload.user,
        payload.submission);
      if (result && result.errors) return result;
    }
    await UserTripHelpers.sendPostPickUpMessage(payload.submission, payload.state);
  }

  static async sendDestinations(payload) {
    const state = { origin: payload.response_url };
    const fields = await NewSlackHelpers.getDestinationFields();
    await Interactions.sendDetailsForm(payload, state, {
      title: 'Destination Details',
      submitLabel: 'Submit',
      callbackId: userTripActions.destDialog,
      fields
    });
  }

  static async saveDestination(payload) {
    if (payload.submission) {
      const result = await UserTripHelpers.handleDestinationDetails(payload.user,
        payload.submission);
      if (result && result.errors) return result;
    }
    await UserTripHelpers.sendPostDestinationMessage(payload.submission, payload.state);
  }

  static async confirmLocation(payload) {
    const location = payload.actions[0].selected_option.text.text;
    console.log(location);
  }

  static async back(payload, respond) {
    const action = payload.actions[0].value;
    switch (action) {
      case 'back_to_launch':
        respond(SlackController.getWelcomeMessage());
        break;
      case userTripActions.forMe:
        return UserTripBookingController.startTripBooking(payload, respond);
      case userTripActions.forSomeone:
        return UserTripBookingController.handleReasonSubmit(payload, respond);
      case userTripActions.addExtraPassengers:
        respond(UserTripHelpers.getAddPassengersMessage());
        break;
      case userTripActions.getDepartment:
        respond(await UserTripHelpers.getDepartmentListMessage(payload));
        break;
      default:
        respond(new SlackInteractiveMessage('Thank you for using Tembea'));
        break;
    }
  }

  static async updateState(state, data = { text: 'Noted' }) {
    if (state) {
      await UpdateSlackMessageHelper.updateMessage(state, data);
    }
  }

  static cancel(data, respond) {
    const message = new BlockMessage([new Block().addText('Thank you for using Tembea')]);
    respond(message);
  }
}
