import WebClientSingleton from '../../../utils/WebClientSingleton';

const web = new WebClientSingleton();

export default class SlackNotifications {
  static async sendNotification(response, teamBotOauthToken) {
    return web.getWebClient(teamBotOauthToken)
      .chat
      .postMessage(response);
  }
}
