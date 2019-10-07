import { Cache, SlackHelpers, AddressService } from '../../../slack/RouteManagement/rootFile';
import {
  SlackText, Block, BlockTypes, SelectElement, ElementTypes, ButtonElement, BlockMessage
} from '../../models/slack-block-models';
import NewSlackHelpers, { sectionDivider } from '../../helpers/slack-helpers';
import { getTripKey } from '../../../../helpers/slack/ScheduleTripInputHandlers';
import DepartmentService from '../../../../services/DepartmentService';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import NewLocationHelpers from '../../helpers/location-helpers';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import {
  tripReasonSchema, userTripPickupSchema, createUserDestinationSchema
} from '../schemas';
import DateDialogHelper from '../../../../helpers/dateHelper';

const prefix = 'user_trip_';
export const userTripActions = Object.freeze({
  forMe: `${prefix}for_me`,
  forSomeone: `${prefix}for_someone`,
  setReason: `${prefix}set_reason`,
  getDepartment: `${prefix}get_department`,
  back: `${prefix}back`,
  reasonDialog: `${prefix}get_reason`,
  addExtraPassengers: `${prefix}add_extra_passengers`,
  noPassengers: `${prefix}no_passengers`,
  setPassenger: `${prefix}set_passenger`,
  pickupDialog: `${prefix}get_pickup`,
  destDialog: `${prefix}get_destination`,
  sendDest: `${prefix}select_destination`,
  selectLocation: `${prefix}select_location`,
  selectPickupLocation: `${prefix}select_pickup_location`,
  selectDestinationLocation: `${prefix}select_destination_location`,
  confirmTripRequest: `${prefix}confirm_trip_request`,
  cancelTripRequest: `${prefix}cancel_trip_request`
});

export const userTripBlocks = Object.freeze({
  start: `${prefix}book_trip_start`,
  selectDepartment: `${prefix}select_department`,
  selectRider: `${prefix}select_rider`,
  selectNumberOfPassengers: `${prefix}select_no_of_passengers`,
  navBlock: `${prefix}nav_block`,
  addPassengers: `${prefix}add_passengers`,
  setRider: `${prefix}set_rider`,
  confirmLocation: `${prefix}confirm_location`,
  getDestFields: `${prefix}set_destination`,
  confirmTrip: `${prefix}confirm_trip_request`
});

export default class UserTripHelpers {
  static createStartMessage() {
    const headerText = new SlackText('Who are you booking for?');
    const header = new Block().addText(headerText);
    const mainButtons = [
      new ButtonElement(new SlackText('For Me'), 'forMe',
        userTripActions.forMe, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('For Someone'), 'forSomeone',
        userTripActions.forSomeone, SlackActionButtonStyles.primary)
    ];

    const newTripBlock = new Block(BlockTypes.actions, userTripBlocks.start);
    newTripBlock.addElements(mainButtons);

    const navigation = UserTripHelpers.getTripNavBlock('back_to_launch');

    const blocks = [header, newTripBlock, new Block(BlockTypes.divider), navigation];
    const message = new BlockMessage(blocks);
    return message;
  }

  static getAddPassengersMessage(forSelf = 'true') {
    const noOfPassengers = NewSlackHelpers.toSlackDropdown(SlackHelpers.noOfPassengers());

    const textBlock = new Block().addText(new SlackText('Any more passengers?'));

    const passengersActions = new Block(BlockTypes.actions, userTripBlocks.addPassengers);
    const selectPassengers = new SelectElement(
      ElementTypes.staticSelect, 'No. of passengers',
      userTripActions.addExtraPassengers
    );
    selectPassengers.addOptions(noOfPassengers);

    const noButton = new ButtonElement(new SlackText('No'), '0', userTripActions.noPassengers,
      'primary');
    passengersActions.addElements([selectPassengers, noButton]);

    const backActionId = forSelf === 'true' ? userTripActions.forMe : userTripActions.forSomeone;
    const navigation = this.getTripNavBlock(backActionId);

    const blocks = [textBlock, passengersActions, sectionDivider, navigation];
    const message = new BlockMessage(blocks);
    return message;
  }

  static getTripNavBlock(value) {
    return NewSlackHelpers.getNavBlock(userTripBlocks.navBlock,
      userTripActions.back, value);
  }

  static getRiderSelectMessage() {
    const options = new SelectElement(ElementTypes.userSelect, 'Select a passenger',
      userTripActions.setPassenger);
    const header = new Block(BlockTypes.section)
      .addText(new SlackText('Who are you booking the ride for?'));

    const actions = new Block(BlockTypes.actions, userTripBlocks.setRider).addElements([options]);

    const navigation = this.getTripNavBlock(userTripActions.forMe);

    const message = new BlockMessage([header, actions, sectionDivider, navigation]);
    return message;
  }

  static async getDepartmentListMessage(payload) {
    const { forSelf } = await Cache.fetch(getTripKey(payload.user.id));
    const personify = forSelf === 'true' ? 'your' : "passenger's";

    const header = new Block(BlockTypes.section)
      .addText(new SlackText(`Please select ${personify} department.`));

    const departmentsList = await DepartmentService.getDepartmentsForSlack(payload.team.id);
    const departmentBlock = new Block(BlockTypes.actions, userTripBlocks.selectDepartment);
    const departmentButtons = departmentsList.map(
      department => new ButtonElement(new SlackText(department.label),
        department.value.toString(),
        `userTripActions.getDepartment_${department.value}`,
        SlackActionButtonStyles.primary)
    );
    departmentBlock.addElements(departmentButtons);

    const navigation = this.getTripNavBlock(userTripActions.addExtraPassengers);

    const message = new BlockMessage([header, departmentBlock, sectionDivider, navigation]);
    return message;
  }

  static async getPostForMeMessage(userId) {
    const userValue = await Cache.fetch(getTripKey(userId));
    let message;
    if (userValue.forSelf === 'true') {
      message = this.getAddPassengersMessage();
    } else {
      message = this.getRiderSelectMessage();
    }
    return message;
  }

  static createContToDestMsg() {
    const header = new Block(BlockTypes.section)
      .addText(new SlackText('Please click to continue'));

    const continueBlock = new Block(BlockTypes.actions, userTripBlocks.getDestFields);

    continueBlock.addElements([
      new ButtonElement(new SlackText('Enter Destinaton'),
        'select_destination',
        userTripActions.sendDest,
        SlackActionButtonStyles.primary)
    ]);

    const navigation = this.getTripNavBlock(userTripActions.getDepartment);
    const message = new BlockMessage([header, continueBlock, sectionDivider, navigation]);
    return message;
  }

  static createTripSummaryMsg() {
    const header = new Block(BlockTypes.section)
      .addText(new SlackText('Trip request preview'));

    const previewActionsBlock = new Block(BlockTypes.actions, userTripBlocks.confirmTrip);
    previewActionsBlock.addElements([
      new ButtonElement(new SlackText('Confirm'), 'confirm',
        userTripActions.confirmTripRequest,
        SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Cancel'), 'cancel',
        userTripActions.cancelTripRequest,
        SlackActionButtonStyles.danger),
    ]);

    const message = new BlockMessage([header, previewActionsBlock]);
    return message;
  }

  static async getLocationVerificationMsg(data, selectActionId, backActionValue) {
    const locationOptions = {
      selectBlockId: userTripBlocks.confirmLocation,
      selectActionId,
      navBlockId: userTripBlocks.navBlock,
      navActionId: userTripActions.back,
      backActionValue,
    };
    return NewLocationHelpers.getLocationVerificationMsg(data, locationOptions);
  }


  static async sendPostPickUpMessage(data, state) {
    const message = await UserTripHelpers.getPostPickupMessage(data);
    const { origin } = JSON.parse(state);
    await UpdateSlackMessageHelper.newUpdateMessage(origin, message);
  }

  static async sendPostDestinationMessage(data, state) {
    const message = await UserTripHelpers.getPostDestinationMessage(data);
    const { origin } = JSON.parse(state);
    await UpdateSlackMessageHelper.newUpdateMessage(origin, message);
  }

  static async getPostPickupMessage(data) {
    const message = data.pickup !== 'Others'
      ? this.createContToDestMsg()
      : await this.getLocationVerificationMsg(data,
        userTripActions.selectPickupLocation,
        userTripActions.getDepartment);
    return !message ? this.createContToDestMsg() : message;
  }

  static async getPostDestinationMessage(data) {
    const message = data.destination !== 'Others'
      ? this.createTripSummaryMsg()
      : await this.getLocationVerificationMsg(data);
    return !message ? this.createTripSummaryMsg() : message;
  }

  static async setReason(userId, data) {
    let submission;
    try {
      submission = NewSlackHelpers.dialogValidator(data, tripReasonSchema);
      await Cache.save(getTripKey(userId), 'reason', submission.reason);
    } catch (err) {
      return err;
    }
  }

  static async sendAddPassengers(state) {
    const message = UserTripHelpers.getAddPassengersMessage();
    const { origin } = JSON.parse(state || {});
    await UpdateSlackMessageHelper.newUpdateMessage(origin, message);
  }

  static async handlePickUpDetails(userId, data) {
    const tripData = await UserTripHelpers.updateTripData(userId, data);
    await Cache.saveObject(getTripKey(userId), tripData);
  }

  static validatePickUpSubmission(data, user) {
    let submission = { ...data };
    submission.dateTime = DateDialogHelper.transformDate(data.dateTime, user.tz_offset);
    submission = NewSlackHelpers.dialogValidator(submission, userTripPickupSchema);
    return submission;
  }

  static hasErrors(submission) {
    return submission && submission.errors;
  }
  static async handlePickUpDetails(user, data) {
    let submission = { ...data };
    try {
      submission.dateTime = DateDialogHelper.transformDate(data.dateTime, user.tz_offset);
      submission = NewSlackHelpers.dialogValidator(submission, userTripPickupSchema);
      await Cache.save(getTripKey(user.id), 'pickup', submission);
      const tripData = await UserTripHelpers.updateTripData(user.id, submission);
      await Cache.saveObject(getTripKey(user.id), tripData);
    } catch (err) {
      return err;
    }
  }

  static async handleDestinationDetails(user, data) {
    try {
      const { pickup: { pickup, othersPickup } } = await Cache.fetch(getTripKey(user.id));
      const thePickup = pickup === 'Others' ? othersPickup : pickup;
      const submission = NewSlackHelpers.dialogValidator(data,
        createUserDestinationSchema(thePickup));
      await Cache.save(getTripKey(user.id), 'destination', submission);
    } catch (err) {
      return err;
    }
  }

  static async updateTripData(userId, { pickup, othersPickup, dateTime },
    tripType = 'Regular Trip') {
    const userTripDetails = await Cache.fetch(getTripKey(userId));
    const userTripData = { ...userTripDetails };
    const pickupCoords = await this.getCoordinates(pickup);
    if (pickupCoords) {
      const { longitude, latitude, id } = pickupCoords.location;
      userTripData.pickupId = id;
      userTripData.pickupLat = latitude;
      userTripData.pickupLong = longitude;
    }
    userTripData.id = userId;
    userTripData.pickup = pickup;
    userTripData.othersPickup = othersPickup;
    userTripData.dateTime = dateTime;
    userTripData.departmentId = userTripDetails.departmentId;
    userTripData.tripType = tripType;
    return userTripData;
  }

  static async getDestinationCoordinates(userId, { destination, othersDestination }) {
    const tripData = await Cache.fetch(getTripKey(userId));
    const tripDetails = { ...tripData };
    const destinationCoords = await this.getCoordinates(destination);
    if (destinationCoords) {
      const { location: { longitude, latitude, id } } = destinationCoords;
      tripDetails.destinationLat = latitude;
      tripDetails.destinationLong = longitude;
      tripDetails.destinationId = id;
    }
    tripDetails.destination = destination;
    tripDetails.othersDestination = othersDestination;
    return tripDetails;
  }

  static async getCoordinates(location) {
    const coordinates = location !== 'Others'
      ? await AddressService.findCoordinatesByAddress(location) : null;

    return coordinates;
  }
}
