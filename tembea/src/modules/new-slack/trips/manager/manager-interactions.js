import { SlackDialog, SlackDialogTextarea } from '../../models/slack-dialog-models';
import DialogPrompts from '../../interactions/DialogPrompts';

export default class ManagerTripInteractions {
  static async sendReasonDialog(
    payload, callbackId, state, dialogName, submitButtonText, submissionName, type = 'trip'
  ) {
    const tripOrRoute = type === 'trip' ? 'trip' : 'route';
    const dialog = new SlackDialog(callbackId || payload.callbackId,
      dialogName, submitButtonText, false, state);

    const commentElement = new SlackDialogTextarea('Reason',
      submissionName,
      `Why do you want to ${submitButtonText} this ${tripOrRoute}?`);
    dialog.addElements([commentElement]);
    await DialogPrompts.sendDialog(dialog, payload);
  }
}
