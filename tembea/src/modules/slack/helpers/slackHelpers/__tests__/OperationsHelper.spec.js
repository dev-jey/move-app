import RouteRequestService from '../../../../../services/RouteRequestService';
import { mockRouteRequestData } from '../../../../../services/__mocks__';
import OperationsNotifications from '../../../SlackPrompts/notifications/OperationsRouteRequest';
import OperationsHelper from '../OperationsHelper';
import { cabService } from '../../../../../services/CabService';
import cache from '../../../../../cache';
import { bugsnagHelper } from '../../../RouteManagement/rootFile';

describe('operations approve request', () => {
  let payload;
  let getRouteRequestAndToken;
  let completeOperationsApprovedAction;
  let updateRouteRequest;
  let routeRequestId;
  let timeStamp;
  let channelId;

  beforeAll(() => {
    jest.spyOn(cache, 'fetch').mockResolvedValue(['12/01/2019', '12/12/2019', 'Saf']);
    getRouteRequestAndToken = jest.spyOn(RouteRequestService, 'getRouteRequestAndToken');
    updateRouteRequest = jest.spyOn(RouteRequestService, 'updateRouteRequest');
    completeOperationsApprovedAction = jest.spyOn(
      OperationsNotifications, 'completeOperationsApprovedAction'
    );
    payload = {
      submission: {
        declineReason: 'QQQQQQ', startDate: '31/01/2019', endDate: '20/02/2019'
      },
      actions: [{ name: 'action', value: '1' }],
      channel: { id: 1 },
      team: { id: 'TEAMID1' },
      original_message: { ts: 'timestamp' },
      user: { id: '4' }
    };
    ({ channel: { id: channelId }, original_message: { ts: timeStamp } } = payload);
    ({ id: routeRequestId } = mockRouteRequestData);

    const state = JSON.stringify({
      approve: {
        timeStamp, channelId, routeRequestId
      }
    });
    payload = {
      ...payload,
      submission: {
        routeName: 'QQQQQQ', takeOffTime: '12:30', cab: 'JDD3883, SDSAS, DDDDD'
      },
      callback_id: 'operations_route_approvedRequest',
      state
    };
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('get cab details if number plate is selected from dropdown', async () => {
    getRouteRequestAndToken.mockResolvedValue(
      { routeRequest: { ...mockRouteRequestData }, slackBotOauthToken: 'dfdf' }
    );
    updateRouteRequest.mockResolvedValue(
      { ...mockRouteRequestData, status: 'Approved' }
    );
    jest.spyOn(OperationsHelper, 'getCabSubmissionDetails');
    await OperationsHelper.sendOpsData(payload);
    expect(RouteRequestService.getRouteRequestAndToken).toHaveBeenCalled();
    expect(RouteRequestService.updateRouteRequest).toHaveBeenCalled();
    completeOperationsApprovedAction.mockReturnValue('Token');
  });
  it('get cab details if a new cab is created', async (done) => {
    payload.callback_id = 'operations_reason_dialog_route';
    payload.submission = {
      cab: 'Create New Cab',
      driverName: 'James',
      driverPhoneNo: 888288912981,
      regNumber: 'KCB 00P',
      capacity: 2,
      model: 'Toyota'
    };

    jest.spyOn(cabService, 'findOrCreateCab').mockResolvedValue({ data: {} });
    await OperationsHelper.getCabSubmissionDetails(payload, payload.submission);
    expect(cabService.findOrCreateCab).toBeCalled();
    done();
  });
  it('should throw an error if route request is not updated', async () => {
    getRouteRequestAndToken.mockResolvedValue(
      { routeRequest: { }, slackBotOauthToken: 'dfdf' }
    );
    updateRouteRequest.mockRejectedValue(new Error('failed'));
    jest.spyOn(bugsnagHelper, 'log');
    await OperationsHelper.sendOpsData(payload);
    expect(bugsnagHelper.log).toHaveBeenCalled();
    completeOperationsApprovedAction.mockReturnValue('Token');
  });
});
