import { IncomingWebhook } from '@slack/client';
import SlackInteractions from '../../SlackInteractions';
import SlackNotifications from '../Notifications';
import models from '../../../../database/models';
import { SlackEvents } from '../../events/slackEvents';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import WebClientSingleton from '../../../../utils/WebClientSingleton';
import NotificationsResponse from '../NotificationsResponse';
import TeamDetailsService from '../../../../services/TeamDetailsService';
import DepartmentService from '../../../../services/DepartmentService';
import RouteRequestService from '../../../../services/RouteRequestService';
import { mockRouteRequestData } from '../../../../services/__mocks__/index';
import Services from '../../../../services/UserService';
import tripService from '../../../../services/TripService';
import responseMock from '../__mocks__/NotificationResponseMock';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import { SlackAttachment, OpsSlackAttachment } from '../__mocks__/NotificationsMocks.mock';
import Cache from '../../../../cache';

const tripInitial = {
  id: 2,
  requestId: null,
  departmentId: 23,
  tripStatus: 'Approved',
  department: null,
  destination: { dataValues: { address: 'Dubai' } },
  origin: { dataValues: { address: 'New York' } },
  pickup: { },
  departureDate: null,
  requestDate: new Date(),
  requester: { dataValues: {} },
  rider: { dataValues: { slackId: 2 } },
};

SlackEvents.raise = jest.fn();

const webClientMock = {
  im: {
    open: () => Promise.resolve({
      channel: { id: '419' }
    })
  },
  users: {
    info: jest.fn(() => Promise.resolve({
      user: { real_name: 'someName', profile: { email: 'someemial@email.com' } },
      token: 'sdf'
    })),
    profile: {
      get: jest.fn(() => Promise.resolve({
        profile: {
          tz_offset: 'someValue',
          email: 'sekito.ronald@andela.com'
        }
      }))
    }
  },
  chat: {
    postMessage: () => Promise.resolve({ data: 'successfully opened chat' })
  }
};

const dbRider = {
  id: 275,
  slackId: '456FDRF',
  name: 'rider Paul',
  phoneNo: null,
  email: 'rider@andela.com',
  defaultDestinationId: null,
  routeBatchId: null,
  createdAt: '2019-03-05T19:32:17.426Z',
  updatedAt: '2019-03-05T19:32:17.426Z'
};

jest.mock('../../../../services/TeamDetailsService', () => ({
  getTeamDetails: jest.fn(() => Promise.resolve({
    botToken: 'just a token',
    webhookConfigUrl: 'just a url',
    opsChannelId: 'S199'
  })),
  getTeamDetailsBotOauthToken: jest.fn(() => Promise.resolve('just a random token'))
}));


describe('SlackNotifications', () => {
  beforeEach(() => {
    const mockUser = { slackId: 3 };
    const result = ['12/2/2019', '12/12/2020', 'Mastercard'];
    jest.spyOn(Cache, 'fetch').mockResolvedValue(result);
    jest.spyOn(DepartmentService, 'getById').mockResolvedValue(mockUser);
    jest.spyOn(DepartmentService, 'getHeadByDeptId').mockResolvedValue(mockUser);
    jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValue(mockUser);
    jest.spyOn(WebClientSingleton.prototype, 'getWebClient').mockReturnValue(webClientMock);
    jest.spyOn(IncomingWebhook.prototype, 'send').mockResolvedValue(true);
    jest.spyOn(Services, 'findOrCreateNewUserWithSlackId').mockResolvedValue(dbRider);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('getDMChannelId', () => {
    it('return an id as received from slack', async (done) => {
      const [id, botToken] = ['419', 'hello'];
      jest.spyOn(WebClientSingleton.prototype, 'getWebClient').mockReturnValue(
        {
          im: {
            open: jest.fn().mockResolvedValue({
              channel: { id }
            })
          }
        }
      );

      const channelId = await SlackNotifications.getDMChannelId(undefined, botToken);

      expect(WebClientSingleton.prototype.getWebClient).toBeCalledWith(botToken);
      expect(channelId).toEqual(id);
      done();
    });
  });

  describe('getManagerMessageAttachment', () => {
    const newTripRequest = tripInitial;
    const imResponse = 'hello';
    const requester = { slackId: '112' };
    const rider = {
      slackId: '767',
      name: 'rider Paul',
      phoneNo: null,
      email: 'rider@andela.com',
      defaultDestinationId: null,
      routeBatchId: null,
      createdAt: '2019-03-05T19:32:17.426Z',
      updatedAt: '2019-03-05T19:32:17.426Z'
    };
    const requestType = 'newTrip';

    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'createDirectMessage');
    });

    it('should create a message', async (done) => {
      const result = await SlackNotifications.getManagerMessageAttachment(newTripRequest,
        imResponse, requester, 'newTrip', rider);

      expect(result).toBeDefined();
      expect(Services.findOrCreateNewUserWithSlackId).toBeCalledWith(rider);
      expect(SlackNotifications.createDirectMessage).toHaveBeenCalledWith(imResponse, expect.anything(), expect.anything());

      const result2 = await SlackNotifications.getManagerMessageAttachment(newTripRequest,
        imResponse, requester, 'notNew', rider);
      expect(result2).toBeDefined();

      done();
    });

    it('should add notification actions when tripStatus is pending', async (done) => {
      jest.spyOn(SlackNotifications, 'notificationActions');
      newTripRequest.tripStatus = 'Pending';

      const result = await SlackNotifications.getManagerMessageAttachment(newTripRequest,
        imResponse, requester, requestType, rider);

      expect(SlackNotifications.notificationActions).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      done();
    });
  });

  describe('sendManagerTripRequestNotification', () => {
    it('should fail when departmentId is wrong', async (done) => {
      jest.spyOn(DepartmentService, 'getHeadByDeptId').mockRejectedValue(true);
      const tripInfo = {
        departmentId: 100,
        requestedById: 100,
        id: 100
      };
      const payload = {
        team: { id: 'HAHJDILYR' }
      };
      const response = jest.fn();

      await SlackNotifications.sendManagerTripRequestNotification(payload, tripInfo, response);

      expect(response).toBeCalledWith({
        text: 'Error:warning:: Request saved, but I could not send a notification to your manager.'
      });
      done();
    });
  });

  describe('sendNotification', () => {
    it('should send notification', async (done) => {
      const res = await SlackNotifications.sendNotification(
        { channel: { id: 'XXXXXX' } },
        {},
        'some text'
      );

      expect(res).toEqual({
        data: 'successfully opened chat'
      });
      done();
    });
  });

  describe('createUserConfirmOrDeclineMessage', () => {
    it('should send notification to user when ride has been confirmed', async (done) => {
      const res = await SlackNotifications.createUserConfirmOrDeclineMessage(true, 'Confirmed');

      expect(res).toEqual('Your trip has been Confirmed, and it is awaiting driver and vehicle assignment');
      done();
    });

    it('should send notification to user when ride has been confirmed', async (done) => {
      const res = await SlackNotifications.createUserConfirmOrDeclineMessage(false, 'declined');

      expect(res).toEqual('Your trip has been declined');
      done();
    });
  });

  describe('sendRequesterDeclinedNotification', () => {
    it('should send error on decline', async (done) => {
      jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockRejectedValue();

      const tripInfo = {
        departmentId: 6,
        requestedById: 1000,
        declinedById: 6,
        origin: {
          dataValues: {
            address: 'Someplace'
          }
        },
        destination: {
          dataValues: {
            address: 'Someplace'
          }
        },
        id: 3
      };
      const response = jest.fn();
      const responseData = {
        text: 'Error:warning:: Decline saved but requester will not get the notification'
      };
      await SlackNotifications.sendRequesterDeclinedNotification(tripInfo, response);
      expect(response).toBeCalledWith(responseData);
      done();
    });

    it('should send decline notification', async (done) => {
      const tripInfo = {
        departmentId: 6,
        requestedById: 6,
        declinedById: 6,
        rider: {
          dataValues:
           {
             name: 'Derrick Kirwa'
           }
        },
        origin: {
          dataValues: {
            address: 'Someplace'
          }
        },
        destination: {
          dataValues: {
            address: 'Someplace'
          }
        },
        id: 3
      };

      jest.spyOn(SlackNotifications, 'getDMChannelId').mockReturnValue(123);
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue();
      await SlackNotifications.sendRequesterDeclinedNotification(
        tripInfo,
        () => {}
      );

      expect(SlackNotifications.sendNotification).toBeCalledTimes(1);
      done();
    });
  });

  describe('sendManagerConfirmOrDeclineNotification', () => {
    it('should send manager notification', async () => {
      const tripInfo = {
        department: {
          dataValues: {
            headId: 3,
          }
        },
        rider: {
          dataValues: {
            slackId: 3,
          }
        },
        origin: {
          dataValues: {
            address: 'never land',
          }
        },
        destination: {
          dataValues: {
            address: 'never land',
          }
        },
        cab: {
          dataValues: {
            driverName: 'Sunday',
            driverPhoneNo: '001001001',
            regNumber: '1928dfsgg'
          }
        }
      };
      const [userId, teamId] = [3, 'HAHJDILYR'];
      const declineStatus = false;
      jest.spyOn(SlackNotifications, 'sendNotifications').mockResolvedValue();

      await SlackNotifications.sendManagerConfirmOrDeclineNotification(
        teamId, userId, tripInfo, declineStatus
      );

      expect(SlackNotifications.sendNotifications).toBeCalledTimes(1);
    });

    it('should send manager confirmation notification', async () => {
      const tripInfo = {
        department: {
          dataValues: {
            headId: 3,
          }
        },
        rider: {
          dataValues: {
            slackId: 3,
          }
        },
        origin: {
          dataValues: {
            address: 'never land',
          }
        },
        destination: {
          dataValues: {
            address: 'never land',
          }
        },
        cab: {
          dataValues: {
            driverName: 'Dave',
            driverPhoneNo: '6789009876',
            regNumber: 'JK 321 LG'
          }
        }
      };

      const payload = {
        user: { id: 3 },
        team: { id: 'HAHJDILYR' },
        submission: {
          driverName: 'driverName', driverPhoneNo: 'driverPhoneNo', regNumber: 'regNumber'
        }
      };
      const { user: { id: userId }, team: { id: teamId } } = payload;
      const declineStatus = true;
      const res = await SlackNotifications.sendManagerConfirmOrDeclineNotification(
        teamId, userId, tripInfo, declineStatus
      );
      expect(res).toEqual(undefined);
    });
  });

  describe('sendManagerTripRequestNotification', () => {
    it('should send the manager a notification', async (done) => {
      const tripInfo = {
        departmentId: 3,
        requestedById: 6,
        id: 3,
      };
      const payload = {
        team: { id: 'HAHJDILYR' }
      };
      const head = {
        email: 'AAAAAA',
        slackId: 'AAAAAA',
      };
      const headData = {
        dataValues: {
          head: {
            dataValues: {
              email: 'AAAAAA',
              slackId: 'AAAAAA',
            }
          }
        }
      };
      const rider = {
        ...head
      };

      const findUserByIdOrSlackId = jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId');
      findUserByIdOrSlackId.mockReturnValueOnce(rider);
      findUserByIdOrSlackId.mockReturnValueOnce({ ...rider, slackId: 'BBBBBB' });

      jest.spyOn(DepartmentService, 'getHeadByDeptId').mockResolvedValue(headData);
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue();
      jest.spyOn(SlackNotifications, 'getManagerMessageAttachment').mockResolvedValue();
      jest.spyOn(SlackNotifications, 'sendNotification').mockResolvedValue(
        { message: 'mockMessageToSlack' }
      );
      jest.spyOn(tripService, 'getById').mockResolvedValue();

      const res = await SlackNotifications.sendManagerTripRequestNotification(
        payload, tripInfo, () => {}
      );
      expect(res).toEqual({ message: 'mockMessageToSlack' });
      done();
    });
  });

  describe('sendWebhookPushMessage', () => {
    it('should call IncomingWebhook send method', async (done) => {
      const [webhookUrl, message] = ['https://hello.com', 'Welcome to tembea'];

      const result = await SlackNotifications.sendWebhookPushMessage(webhookUrl, message);

      expect(IncomingWebhook.prototype.send).toHaveBeenCalledWith(message);
      expect(result).toBeTruthy();
      done();
    });
  });

  describe('User Notification', () => {
    const tripInfo = {
      requester: {
        dataValues: {
          slackId: 3,
        }
      },
      rider: {
        dataValues: {
          slackId: 3,
        }
      },
      origin: {
        dataValues: {
          address: 'never land',
        }
      },
      destination: {
        dataValues: {
          address: 'never land',
        }
      },
      cab: {
        dataValues: {
          driverName: 'Dave',
          driverPhoneNo: '6789009876',
          regNumber: 'JK 321 LG'
        }
      },
      driver: {
        dataValues: {
          driverName: 'Dave',
          driverPhoneNo: '6789009876',
        }
      }
    };
    const declineStatusFalse = false;
    const declineStatusTrue = true;
    const opsStatus = true;
    const payload = {
      user: { id: 3 },
      team: { id: 'HAHJDILYR' },
      submission: {
        driverName: 'driverName', driverPhoneNo: 'driverPhoneNo', regNumber: 'regNumber'
      }
    };

    const { user: { id: userId }, team: { id: teamId } } = payload;
    it('should send user notification when requester is equal to rider', async () => {
      tripInfo.rider.slackId = 3;
      const res = await SlackNotifications.sendUserConfirmOrDeclineNotification(teamId, userId, tripInfo, declineStatusFalse, opsStatus);
      expect(res).toEqual(undefined);
    });

    it('should send user notification when requester is not equal to rider', async () => {
      tripInfo.rider.slackId = 4;
      const res = await SlackNotifications.sendUserConfirmOrDeclineNotification(
        teamId, userId, tripInfo, declineStatusFalse, opsStatus
      );
      expect(res).toEqual(undefined);
    });
    
    it('should send user confirmation notification when requester is not equal to rider', async () => {
      tripInfo.rider.slackId = 4;
      const res = await SlackNotifications.sendUserConfirmOrDeclineNotification(teamId, userId, tripInfo, declineStatusTrue, opsStatus);
      expect(res).toEqual(undefined);
    });
  
    it('should send user confirmation notification when requester is equal to rider', async () => {
      tripInfo.rider.slackId = 3;
      const res = await SlackNotifications.sendUserConfirmOrDeclineNotification(
        teamId, userId, tripInfo, declineStatusTrue, opsStatus
      );
      expect(res).toEqual(undefined);
    });

    it('should send user confirmation notification when requester is equal to rider', async () => {
      tripInfo.rider.slackId = 3;
      const res = await SlackNotifications.sendUserConfirmOrDeclineNotification(
        teamId, userId, tripInfo, declineStatusFalse, opsStatus
      );
      expect(res).toEqual(undefined);
    });
  });

  describe('sendRequesterApprovedNotification', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    let sendNotification;
    let findSelectedDepartment;
    let responseForRequester;
    beforeEach(() => {
      findSelectedDepartment = jest.spyOn(DepartmentService, 'getById');
      responseForRequester = jest.spyOn(NotificationsResponse, 'responseForRequester');
      sendNotification = jest.spyOn(SlackNotifications, 'sendNotification');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should successfully send approve notification to requester', async () => {
      const fn = () => ({});
      // mock dependencies
      findSelectedDepartment.mockImplementationOnce(() => (
        { head: { name: 'Tembea' } }));
      responseForRequester.mockImplementationOnce(fn);
      sendNotification.mockImplementationOnce(fn);

      const responseData = { ...tripInitial, requester: { slackId: 2 } };
      await SlackNotifications
        .sendRequesterApprovedNotification(responseData, jest.fn(), 'slackBotOauthToken');

      expect(findSelectedDepartment).toHaveBeenCalledTimes(1);
      expect(responseForRequester).toHaveBeenCalledTimes(1);
      expect(sendNotification).toHaveBeenCalledTimes(1);
    });
    it('should handle error', async () => {
      // mock dependencies
      const error = new Error('Dummy error message');
      findSelectedDepartment.mockImplementationOnce(() => Promise.reject(error));

      const responseData = { ...tripInitial, requester: { slackId: 2 } };
      const respond = jest.fn();
      await SlackNotifications
        .sendRequesterApprovedNotification(responseData, respond, 'slackBotOauthToken');

      expect(findSelectedDepartment).toHaveBeenCalledTimes(1);
      expect(respond).toHaveBeenCalledTimes(1);
      expect(responseForRequester).not.toHaveBeenCalled();
      expect(sendNotification).not.toHaveBeenCalled();
    });
    it('should return undefined if department is null', async () => {
      // mock dependencies
      findSelectedDepartment.mockImplementationOnce(() => null);

      const responseData = { ...tripInitial, requester: { slackId: 2 } };
      const respond = jest.fn();
      await SlackNotifications
        .sendRequesterApprovedNotification(responseData, respond, 'slackBotOauthToken');

      expect(findSelectedDepartment).toHaveBeenCalledTimes(1);
      expect(respond).not.toHaveBeenCalled();
      expect(responseForRequester).not.toHaveBeenCalled();
      expect(sendNotification).not.toHaveBeenCalled();
    });
  });

  describe('sendOperationsTripRequestNotification', () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    const fn = () => {};
    const payload = {
      team: { id: 'AHDJDLKUER' },
      user: { id: 'AHDJDLKUER' }
    };

    let respond;
    let getTripRequest;
    let getTeamDetails;
    let getDepartment;
    let sendRequesterApprovedNotification;
    let sendNotification;
    beforeEach(() => {
      respond = jest.fn(value => value);
      getTripRequest = jest.spyOn(tripService, 'getById');
      getTeamDetails = jest.spyOn(TeamDetailsService, 'getTeamDetails');
      getDepartment = jest.spyOn(DepartmentService, 'getById');
      sendNotification = jest.spyOn(SlackNotifications, 'sendNotification');
      sendRequesterApprovedNotification = jest.spyOn(SlackNotifications,
        'sendRequesterApprovedNotification');

      getTripRequest.mockImplementationOnce(() => ({
        createdAt: '',
        departureTime: '',
        rider: { dataValues: { slackId: 1 } },
        requester: { dataValues: { slackId: 1 } },
        destination: { dataValues: {} },
        origin: { dataValues: {} },
        tripDetail: { dataValues: {} },
        departmentId: 1,
        id: 2,
        tripStatus: 'ca'
      }));
      sendRequesterApprovedNotification.mockImplementationOnce(fn);
      const department = { name: 'Tembea DTP' };
      getDepartment.mockImplementationOnce(() => (
        { dataValues: { department }, department }
      ));
      getTeamDetails.mockImplementationOnce(() => (
        { botToken: 'slackBotOauthToken', opsChannelId: 1 }
      ));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should notify ops on manager\'s approval', async () => {
      sendNotification.mockImplementationOnce(fn);
      await SlackNotifications.sendOperationsTripRequestNotification(
        responseMock, payload, respond
      );
      expect(sendNotification).toHaveBeenCalledTimes(1);
      expect(respond).not.toHaveBeenCalled();
    });
    it('should test for that that is not regular', async () => {
      sendNotification.mockImplementationOnce(fn);
      await SlackNotifications.sendOperationsTripRequestNotification(
        responseMock, payload, respond, 'not regular'
      );
      expect(sendNotification).toHaveBeenCalled();
    });
    it('should test throw an error', async () => {
      sendNotification.mockImplementationOnce(fn);
      const res = await SlackNotifications.sendOperationsTripRequestNotification(
        responseMock, null, respond, 'not regular'
      );
      expect(res).toEqual(undefined);
    });
  });

  describe('SlackNotifications Tests: Manager approval', () => {
    const { TripRequest, User, Department } = models;

    beforeEach(() => {
      jest.spyOn(TripRequest, 'findByPk').mockResolvedValue({ dataValues: tripInitial });
      jest.spyOn(User, 'findOne').mockResolvedValue({ dataValues: { id: 45 } });
      jest.spyOn(Department, 'findByPk').mockResolvedValue({
        dataValues: { head: { dataValues: {} } }
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });


    it('Handle manager approve details request and throw an error', async (done) => {
      const payload = {
        actions: [{ name: 'managerApprove' }],
        user: {},
        submission: {}
      };
      const manager = await SlackInteractions.handleManagerApprovalDetails(payload, jest.fn);
      expect(manager).toEqual(undefined);
      done();
    });


    it('Handle manager approve details request but fail to approve', async (done) => {
      const payload = {
        actions: [{ name: 'manager_approve' }],
        user: {},
        submission: {}
      };
      const manager = await SlackInteractions.handleManagerApprovalDetails(payload, jest.fn);
      expect(manager).toEqual(undefined);
      done();
    });
  });

  describe('SlackNotifications: receive new route request', () => {
    let getTeamDetails;
    let routeRequestDetails;
    beforeEach(() => {
      getTeamDetails = jest.spyOn(TeamDetailsService, 'getTeamDetails');
      getTeamDetails.mockImplementationOnce(() => (
        { botToken: 'slackBotOauthToken', opsChannelId: 1 }
      ));
      routeRequestDetails = jest.spyOn(RouteRequestService, 'getRouteRequest');
      routeRequestDetails.mockImplementation(() => ({
        distance: 2,
        busStopDistance: 3,
        routeImageUrl: 'image',
        busStop: { address: 'busstop' },
        home: { address: 'home' },
        manager: { slackId: '1234' },
        engagement: {
          partner: { name: 'partner' },
          startDate: '11-12-2018',
          endDate: '11-12-2019',
          workHours: '10:00-22:00',
          fellow: { slackId: '4321' }
        }
      }));
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('should send route request to ops channel', async () => {
      const teamId = 'AHDJDLKUER';
      jest.spyOn(RouteRequestService, 'getRouteRequest')
        .mockResolvedValue(mockRouteRequestData);
      jest.spyOn(TeamDetailsService, 'getTeamDetails')
        .mockResolvedValue({ botToken: 'AAAAAA', opsChannelId: 'BBBBBB' });
      jest.spyOn(SlackNotifications, 'sendOperationsNotificationFields');
      jest.spyOn(SlackNotifications, 'sendNotifications')
        .mockResolvedValue();
      await SlackNotifications.sendOperationsNewRouteRequest(teamId, '1');
      expect(SlackNotifications.sendOperationsNotificationFields)
        .toHaveBeenCalledWith(mockRouteRequestData);
      expect(SlackNotifications.sendNotifications).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendRiderlocationConfirmNotification', () => {
    it('Should send request to rider', async () => {
      const sendNotifications = jest.spyOn(SlackNotifications, 'sendNotifications');
      await SlackNotifications.sendRiderlocationConfirmNotification({
        location: 'location',
        teamID: 'teamID',
        userID: 1,
        rider: 1
      });
      expect(sendNotifications).toHaveBeenCalled();
    });
  });

  describe('sendOperationsRiderlocationConfirmation', () => {
    it('Should send confrimation to Ops', async () => {
      const sendNotifications = jest.spyOn(SlackNotifications, 'sendNotifications');
      const getTeamDetails = jest.spyOn(TeamDetailsService, 'getTeamDetails').mockResolvedValue({
        botToken: { slackBotOauthToken: 'yahaha' },
        opsChannelId: 'qwertyuoi'
      });
      await SlackNotifications.sendOperationsRiderlocationConfirmation({
        riderID: 1,
        teamID: 'rtyui',
        confirmedLocation: 'Nairobi',
        waitingRequester: 1,
        location: 'Pickup'
      });
      expect(getTeamDetails).toHaveBeenCalled();
      expect(sendNotifications).toHaveBeenCalled();
    });

    it('Should call respond and bugsnug', async () => {
      const respond = jest.fn();
      bugsnagHelper.log = jest.fn().mockReturnValue({});

      SlackNotifications.sendNotification = jest.fn().mockImplementation(() => {
        throw new Error('Dummy error');
      });
      await SlackNotifications.sendOperationsRiderlocationConfirmation({
        riderID: 1,
        teamID: 'rtyui',
        confirmedLocation: 'Nairobi',
        waitingRequester: 1,
        location: 'Pickup'
      }, respond);
      expect(bugsnagHelper.log).toHaveBeenCalled();
      expect(respond).toHaveBeenCalled();
    });
  });

  describe('Get manager attachments', () => {
    beforeEach(() => {
      jest.spyOn(Services, 'findOrCreateNewUserWithSlackId').mockResolvedValue({});
      jest.spyOn(SlackNotifications, 'notificationFields').mockResolvedValue({});
    });

    it('Should get manager cancel attachment when requester is rider', async () => {
      const [newTripRequest, imResponse, requester, rider] = [
        {}, {}, { slackId: '090OPI' }, { slackId: '090OPI' }
      ];
      const message = `Hey, <@${requester.slackId}> has just cancelled this trip.`;
      const createDirectMessageSpy = jest.spyOn(SlackNotifications, 'createDirectMessage');
      await SlackNotifications.getManagerCancelAttachment(
        newTripRequest, imResponse, requester, rider
      );
      expect(Services.findOrCreateNewUserWithSlackId).toHaveBeenCalled();
      expect(SlackNotifications.notificationFields).toHaveBeenCalled();
      expect(createDirectMessageSpy).toHaveBeenCalledWith({}, message, SlackAttachment);
    });

    it('Should get manager cancel attachment when requester is not rider', async () => {
      const [newTripRequest, imResponse, requester, rider] = [
        {}, {}, { slackId: '090OPJKL' }, { slackId: '090OPI' }
      ];
      const message = `Hey, <@${requester.slackId}> has just cancelled this trip for <@${
        rider.slackId}>.`;
      const createDirectMessageSpy = jest.spyOn(SlackNotifications, 'createDirectMessage');
      await SlackNotifications.getManagerCancelAttachment(
        newTripRequest, imResponse, requester, rider
      );
      expect(Services.findOrCreateNewUserWithSlackId).toHaveBeenCalled();
      expect(SlackNotifications.notificationFields).toHaveBeenCalled();
      expect(createDirectMessageSpy).toHaveBeenCalledWith({}, message, SlackAttachment);
    });
  });

  describe('Get operations attachments', () => {
    beforeEach(() => {
      jest.spyOn(SlackNotifications, 'notificationFields').mockResolvedValue({});
    });

    it('Should get Ops cancel attachment when requester is rider', async () => {
      const [tripDetails, requester, rider, channelId] = [
        {}, { slackId: '090OPI' }, { slackId: '090OPI' }, 'EPP009'
      ];
      const message = `Hey, <@${requester.slackId}> has just cancelled this trip.`;
      const createDirectMessageSpy = jest.spyOn(SlackNotifications, 'createDirectMessage');

      await SlackNotifications.getOperationCancelAttachment(
        tripDetails, requester, rider, channelId
      );
      expect(SlackNotifications.notificationFields).toHaveBeenCalled();
      expect(createDirectMessageSpy).toHaveBeenCalledWith(channelId, message, OpsSlackAttachment);
    });

    it('Should get Ops cancel attachment when requester is not the rider', async () => {
      const [tripDetails, requester, rider, channelId] = [
        {}, { slackId: '090O33' }, { slackId: '090OPI' }, 'EPP009'
      ];
      const message = `Hey, <@${requester.slackId}> has just cancelled this trip for <@${
        rider.slackId}>.`;
      const createDirectMessageSpy = jest.spyOn(SlackNotifications, 'createDirectMessage');

      await SlackNotifications.getOperationCancelAttachment(
        tripDetails, requester, rider, channelId
      );
      expect(SlackNotifications.notificationFields).toHaveBeenCalled();
      expect(createDirectMessageSpy).toHaveBeenCalledWith(channelId, message, OpsSlackAttachment);
    });
  });

  describe('Send manager cancel notifications', () => {
    const tripInfo = {
      id: '090OPI', departmentId: '090OPI', requestedById: '090OPI', riderId: '090OPI'
    };
    const respond = jest.fn();
    const data = { team: { id: 'teamId' } };
    beforeEach(() => {
      jest.spyOn(DepartmentService, 'getHeadByDeptId').mockResolvedValue({ slackId: 'OOO908' });
      jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValue('Adaeze');
      jest.spyOn(tripService, 'getById').mockResolvedValue({});
      jest.spyOn(TeamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('TKD44OL');
      jest.spyOn(SlackNotifications, 'getDMChannelId').mockResolvedValue({});
    });

    it('Should send manager notification successfully', async () => {
      jest.spyOn(SlackNotifications, 'getManagerCancelAttachment').mockResolvedValue({});
      const getManagerCancelAttachmentSpy = jest.spyOn(
        SlackNotifications, 'getManagerCancelAttachment'
      );
      await SlackNotifications.sendManagerCancelNotification(data, tripInfo, respond);
      expect(DepartmentService.getHeadByDeptId).toHaveBeenCalled();
      expect(SlackHelpers.findUserByIdOrSlackId).toHaveBeenCalled();
      expect(tripService.getById).toHaveBeenCalled();
      expect(TeamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalled();
      expect(getManagerCancelAttachmentSpy).toHaveBeenCalled();
    });

    it('Should run the catch block when there is an error', async () => {
      jest.spyOn(SlackNotifications, 'getManagerCancelAttachment').mockRejectedValue({});
      await SlackNotifications.sendManagerCancelNotification(data, tripInfo, respond);
      expect(respond).toHaveBeenCalled();
    });
  });
  describe('Send Ops cancel notifications', () => {
    const respond = jest.fn();
    const data = { team: { id: 'teamId' } };
    const tripInfo = {
      requester: '090OPI', rider: '090OPI'
    };
    beforeEach(() => {
      jest.spyOn(TeamDetailsService, 'getTeamDetails').mockResolvedValue({});
    });

    it('Should send cancel notification to the operations team', async () => {
      jest.spyOn(SlackNotifications, 'getOperationCancelAttachment').mockResolvedValue({});
      const sendNotificationSpy = jest.spyOn(SlackNotifications, 'sendNotification');
      await SlackNotifications.sendOpsCancelNotification(data, tripInfo, respond);
      expect(TeamDetailsService.getTeamDetails).toHaveBeenCalled();
      expect(SlackNotifications.getOperationCancelAttachment).toHaveBeenCalled();
      expect(sendNotificationSpy).toHaveBeenCalled();
    });

    it('Should run catch block when there is an error', async () => {
      jest.spyOn(SlackNotifications, 'getOperationCancelAttachment').mockRejectedValue({});
      await SlackNotifications.sendOpsCancelNotification(data, tripInfo, respond);
      expect(respond).toHaveBeenCalled();
    });
  });


  describe('getOpsMessageAttachment', () => {
    const newTripRequest = {
      requester: {
        slackId: 'HURT1233'
      },
      rider: {
        slackId: 'HURT1233'
      }
    };
    const mockData = [];
    beforeEach(() => {
      jest.spyOn(Services, 'findOrCreateNewUserWithSlackId');
      jest.spyOn(SlackNotifications, 'notificationFields').mockResolvedValue(mockData);
      jest.spyOn(SlackNotifications, 'createDirectMessage');
    });

    it('sends notification to ops when user has booked themselves', async () => {
      await SlackNotifications.getOpsMessageAttachment(newTripRequest, 1, 'HURT1234');
      expect(Services.findOrCreateNewUserWithSlackId).toHaveBeenCalledWith(newTripRequest.rider);
      expect(SlackNotifications.notificationFields).toHaveBeenCalledWith(newTripRequest);
      expect(SlackNotifications.createDirectMessage).toHaveBeenCalled();
    });

    it('sends notification to ops when user has been booked for', async () => {
      newTripRequest.rider = {
        slackId: 'HGY1234'
      };

      await SlackNotifications.getOpsMessageAttachment(newTripRequest, 1, 'HURT1234');
      expect(Services.findOrCreateNewUserWithSlackId).toHaveBeenCalledWith(newTripRequest.rider);
      expect(SlackNotifications.notificationFields).toHaveBeenCalledWith(newTripRequest);
      expect(SlackNotifications.createDirectMessage).toHaveBeenCalled();
    });
  });

  describe('sendOpsTripRequestNotification', () => {
    const trip = {
      requestedById: 'Hello123',
      riderId: 10,
      departmentId: 2,
      id: 3
    };

    const tripData = {
      departmentId: 2
    };


    const requester = {
      id: 1,
      slackId: 'HURT123',
      name: 'John',
    };

    const rider = {
      id: 10,
      slackId: 'HELLO1',
      name: 'David',
    };

    const payload = {
      team: {
        id: 1
      }
    };

    const dataReturned = {
      botToken: 'WELL1',
      opsChannelId: 2
    };

    const department = {
      name: 'TDD'
    };

    const deptHead = {
      slackId: 'TTT1',
    };

    const resolvedData = {
      channel: 'ABC123',
      text: 'hello world',
      attachment: []
    };


    let respond;

    beforeEach(() => {
      respond = jest.fn();
      jest.spyOn(tripService, 'getById').mockResolvedValue(tripData);
      jest.spyOn(TeamDetailsService, 'getTeamDetails').mockResolvedValue(dataReturned);
      jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValueOnce(requester);
      jest.spyOn(SlackHelpers, 'findUserByIdOrSlackId').mockResolvedValueOnce(rider);
      jest.spyOn(DepartmentService, 'getById').mockResolvedValue(department);
      jest.spyOn(SlackNotifications, 'sendNotification');
      jest.spyOn(SlackNotifications, 'opsNotificationMessage');
      jest.spyOn(SlackNotifications, 'getOpsMessageAttachment').mockResolvedValue(resolvedData);
      jest.spyOn(DepartmentService, 'getHeadByDeptId').mockResolvedValue(deptHead);
      jest.spyOn(SlackNotifications, 'sendNotification');
      bugsnagHelper.log = jest.fn();
    });

    it('should send a notification to the operations team when a user request a trip', async () => {
      await SlackNotifications.sendOpsTripRequestNotification(payload, trip, respond);
      expect(SlackNotifications.opsNotificationMessage).toHaveBeenCalledWith(payload.team.id, trip);
      expect(SlackHelpers.findUserByIdOrSlackId).toHaveBeenCalledTimes(2);
      expect(TeamDetailsService.getTeamDetails).toHaveBeenCalledWith(payload.team.id);
      expect(DepartmentService.getById).toHaveBeenCalledWith(trip.departmentId);
      expect(tripService.getById).toHaveBeenCalledWith(trip.id);
      expect(SlackNotifications.getOpsMessageAttachment).toHaveBeenCalledWith(tripData, dataReturned.opsChannelId, deptHead.slackId);
      expect(SlackNotifications.sendNotification).toHaveBeenCalled();
    });

    it('should returns an error when the notification fails to send', async () => {
      jest.spyOn(SlackNotifications, 'sendNotification').mockRejectedValueOnce('An error just occured');
      await SlackNotifications.sendOpsTripRequestNotification(payload, trip, respond);
      expect(bugsnagHelper.log).toHaveBeenCalledWith('An error just occured');
      expect(respond).toHaveBeenCalled();
    });
  });
});
