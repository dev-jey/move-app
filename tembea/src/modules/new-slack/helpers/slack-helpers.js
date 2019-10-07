import {
  ButtonElement, CancelButtonElement,
  SlackText, Block, BlockTypes
} from '../models/slack-block-models';
import Validators from '../../../helpers/slack/UserInputValidator/Validators';
import {
  SlackDialogError,
  SlackDialogSelectElementWithOptions,
  SlackDialogText
} from '../../slack/SlackModels/SlackDialogModels';
import { toLabelValuePairs, dateHint } from '../../../helpers/slack/createTripDetailsForm';
import { pickupLocations } from '../../../utils/data';
import tripService from '../../../services/TripService';
import UserService from '../../../services/UserService';

export const sectionDivider = new Block(BlockTypes.divider);
export const defaultKeyValuePairs = { text: 'text', value: 'value' };

export default class NewSlackHelpers {
  static getNavButtons(backValue, backActionId) {
    const navigationButtons = [
      new ButtonElement(new SlackText('< Back'), backValue, backActionId),
      new CancelButtonElement('Cancel', 'cancel', 'cancel', {
        title: 'Are you sure?',
        description: 'Do you really want to cancel',
        confirmText: 'Yes',
        denyText: 'No'
      })
    ];
    return navigationButtons;
  }

  static getNavBlock(blockId, backActionId, backValue) {
    const navButtons = NewSlackHelpers.getNavButtons(backValue, backActionId);
    const navigation = new Block(BlockTypes.actions, blockId);
    navigation.addElements(navButtons);
    return navigation;
  }

  static dialogValidator(data, schema) {
    try {
      const results = Validators.validateSubmission(data, schema);
      return results;
    } catch (err) {
      const error = new Error('dialog validation failed');
      error.errors = err.errors.details.map((e) => {
        const key = e.path[0];
        return new SlackDialogError(key,
          e.message || 'the submitted property for this value is invalid');
      });
      throw error;
    }
  }

  static hasNeededProps(data, keyPairs) {
    let hasProps = false;
    if (data) {
      const func = Object.prototype.hasOwnProperty;
      hasProps = func.call(data, keyPairs.text) && func.call(data, keyPairs.value);
    }
    return hasProps;
  }

  static toSlackDropdown(data, keyPairs = defaultKeyValuePairs) {
    return data.filter(e => this.hasNeededProps(e, keyPairs))
      .map(entry => ({
        text: new SlackText(entry[keyPairs.text].toString()),
        value: entry[keyPairs.value].toString()
      }));
  }

  static async getPickupFields() {
    const locations = toLabelValuePairs(pickupLocations);
    const pickupField = new SlackDialogSelectElementWithOptions('Pickup location',
      'pickup', locations);

    const othersPickupField = new SlackDialogText('Others?',
      'othersPickup', 'Enter pickup location', true);

    const dateField = new SlackDialogText('Date and Time',
      'dateTime', 'dd/mm/yy hh:mm', false, dateHint);

    return [
      dateField,
      pickupField,
      othersPickupField,
    ];
  }

  static async getDestinationFields() {
    const locations = toLabelValuePairs(pickupLocations);
    const destinationField = new SlackDialogSelectElementWithOptions('Destination location',
      'destination', locations);

    const othersDestinationField = new SlackDialogText('Others?',
      'othersDestination', 'Enter destination', true);

    return [
      destinationField,
      othersDestinationField
    ];
  }

  static createDirectMessage(channelId, text, payload) {
    let blocks = [payload];
    if (payload instanceof Array) {
      blocks = payload;
    }
    return {
      channel: channelId,
      text,
      blocks
    };
  }

  static async isRequestApproved(requestId, slackId) {
    let isApproved = false;
    let approvedBy = null;
    const trip = await tripService.getById(requestId);

    if (!trip) {
      return { isApproved: false, approvedBy };
    }

    const { tripStatus, approvedById } = trip;

    if (approvedById && tripStatus && tripStatus.toLowerCase() !== 'pending') {
      isApproved = true;
      const user = await NewSlackHelpers.findUserByIdOrSlackId(approvedById);
      approvedBy = slackId === user.slackId ? '*You*' : `<@${user.slackId}>`;
    }

    return { isApproved, approvedBy };
  }

  static async findUserByIdOrSlackId(userId) {
    let user;
    const normalizedId = Number.parseInt(userId, 10);
    if (Number.isInteger(normalizedId)) {
      user = await UserService.getUserById(normalizedId);
    } else {
      user = await UserService.getUserBySlackId(userId);
    }
    const result = user ? user.dataValues : undefined;
    return result;
  }

  static async approveRequest(requestId, managerId, description) {
    let approved = false;
    const user = await NewSlackHelpers.findUserByIdOrSlackId(managerId);
    const update = await tripService.updateRequest(requestId, {
      approvedById: user.id,
      managerComment: description,
      tripStatus: 'Approved'
    });

    if (update) { approved = true; }

    return approved;
  }
}
