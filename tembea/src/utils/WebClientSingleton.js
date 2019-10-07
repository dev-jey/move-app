import { WebClient } from '@slack/client';

class WebClientSingleton {
  constructor() {
    if (WebClientSingleton.exists) {
      return WebClientSingleton.instance;
    }
    this.web = new WebClient(process.env.SLACK_BOT_OAUTH_TOKEN);
    WebClientSingleton.instance = this;
    WebClientSingleton.exists = true;
  }

  getWebClient(teamBotOauthToken) {
    return teamBotOauthToken ? new WebClient(teamBotOauthToken) : this.web;
  }
}

export default WebClientSingleton;
