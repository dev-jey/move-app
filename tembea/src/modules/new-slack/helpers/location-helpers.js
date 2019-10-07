import {
  Block, BlockTypes, SlackText, SelectElement, ElementTypes, BlockMessage
} from '../models/slack-block-models';
import NewSlackHelpers, { sectionDivider } from './slack-helpers';
import LocationHelpers from '../../../helpers/googleMaps/locationsMapHelpers';

export default class NewLocationHelpers {
  static createLocationConfirmMsg(details, {
    selectBlockId, selectActionId, navBlockId, navActionId, backActionValue
  }) {
    const header = new Block(BlockTypes.section)
      .addText(new SlackText('Please confirm your location'));

    const mapBlock = new Block(BlockTypes.actions, selectBlockId);
    const selectPlace = new SelectElement(ElementTypes.staticSelect,
      'Select the nearest location', selectActionId);

    const places = NewSlackHelpers.toSlackDropdown(details.predictions, {
      text: 'description', value: 'place_id'
    });
    selectPlace.addOptions(places);

    mapBlock.addElements([
      selectPlace
    ]);

    const navigation = NewSlackHelpers.getNavBlock(navBlockId,
      navActionId, backActionValue);
    const message = new BlockMessage([header, mapBlock, sectionDivider, navigation]);
    return message;
  }

  static async getLocationVerificationMsg(data, options) {
    const details = await LocationHelpers.getPredictionsOnMap(data.othersPickup);
    return details ? this.createLocationConfirmMsg(details, options) : false;
  }
}
