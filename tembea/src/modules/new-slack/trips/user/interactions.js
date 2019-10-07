import { SlackDialog, SlackDialogTextarea } from '../../../slack/SlackModels/SlackDialogModels';
import { userTripActions } from './user-trip-helpers';
import { DialogPrompts } from '../../../slack/RouteManagement/rootFile';

export default class Interactions {
  static async sendTripReasonForm(payload, state) {
    const dialog = new SlackDialog(userTripActions.reasonDialog,
      'Reason for booking trip', 'Submit', '', JSON.stringify(state));
    const textarea = new SlackDialogTextarea('Reason', 'reason',
      'Enter reason for booking the trip');

    dialog.addElements([textarea]);
    await DialogPrompts.sendDialog(dialog, payload);
  }

  static async sendDetailsForm(payload, state, {
    title, submitLabel, callbackId, fields
  }) {
    const dialog = new SlackDialog(callbackId,
      title, submitLabel, '', JSON.stringify(state));
    dialog.addElements(fields);
    await DialogPrompts.sendDialog(dialog, payload);
  }
}
