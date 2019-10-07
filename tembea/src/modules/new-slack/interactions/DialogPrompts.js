import { SlackDialogModel } from '../models/slack-dialog-models';
import TeamDetailsService from '../../../services/TeamDetailsService';
import WebClientSingleton from '../../../utils/WebClientSingleton';
import BugsnagHelper from '../../../helpers/bugsnagHelper';

const web = new WebClientSingleton();

export default class DialogPrompts {
  static async sendDialog(dialog, payload) {
    const dialogForm = new SlackDialogModel(payload.trigger_id, dialog);
    const { team: { id: teamId } } = payload;
    const slackBotOauthToken = await TeamDetailsService.getTeamDetailsBotOauthToken(teamId);
    await DialogPrompts.sendDialogTryCatch(dialogForm, slackBotOauthToken);
  }

  static async sendDialogTryCatch(dialogForm, teamBotOauthToken) {
    try {
      await web.getWebClient(teamBotOauthToken).dialog.open(dialogForm);
    } catch (error) {
      BugsnagHelper.log(error);
      throw new Error('There was a problem processing your request');
    }
  }

  /**
 * @description Update a previously sent message
 * @param  {string} channel The channel to which the original message was sent
 * @param  {string} text The message text
 * @param  {string} timeStamp The time stamp of the original message
 * @param  {array} attachments The attachments
 * @param {string} slackBotOauthToken The team bot token
 */
  static async messageUpdate(channel, text, timeStamp, blocks, slackBotOauthToken) {
    await web.getWebClient(slackBotOauthToken).chat.update({
      channel,
      text,
      ts: timeStamp,
      blocks
    });
  }
}
