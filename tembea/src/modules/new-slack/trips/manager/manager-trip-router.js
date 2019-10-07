
import managerTripActions from './actions';
import managerTripBlocks from './blocks';
import ManagerTripController from './manager-trip-controller';
import ManagerTripHelper from './manager-trip-helpers';

const managerTripRoutes = [
  {
    route: { callbackId: managerTripActions.managerReasonApprove },
    handler: ManagerTripController.handleManagerApprovalDetails
  },
  {
    route: { actionId: managerTripActions.managerApprove, blockId: managerTripBlocks.managerActionsBlock },
    handler: ManagerTripController.handleManagerActions
  },
  {
    route: { actionId: managerTripActions.managerDecline, blockId: managerTripBlocks.managerActionsBlock },
    handler: ManagerTripController.handleManagerActions
  },
  {
    route: { callbackId: managerTripActions.managerReasonDecline },
    handler: ManagerTripController.handleManagerActions
  }
];

export default slackRouter => managerTripRoutes.forEach((route) => {
  slackRouter.action(route.route, route.handler);
});
