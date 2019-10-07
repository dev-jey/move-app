import bugsnag from '@bugsnag/js';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { environment } from 'src/environments/environment';

const bugsnagKey = environment.BUGSNAG_API_KEY;
const bugsnagClient = bugsnag(bugsnagKey);

export const errorHandlerFactory = () => {
  return new BugsnagErrorHandler(bugsnagClient);
};
