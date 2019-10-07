const getAllResponseMock = {
  routes: [
    {
      'id': 1,
      'distance': null,
      'opsComment': null,
      'managerComment': null,
      'engagementId': 1,
      'managerId': 1,
      'busStopId': 1,
      'homeId': 1,
      'busStopDistance': null,
      'routeImageUrl': null,
      'status': 'Pending',
      'createdAt': '2019-02-06T15:09:21.991Z',
      'updatedAt': '2019-02-06T15:09:21.991Z',
      'manager': {
        'id': 1,
        'name': 'New Name',
        'slackId': 'XXXXXXXXX',
        'phoneNo': '2349782037189',
        'email': 'me.you@test.com',
        'defaultDestinationId': null,
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2019-02-06T15:09:04.311Z'
      },
      'busStop': {
        'id': 1,
        'locationId': 1,
        'address': null,
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2018-11-14T00:00:00.000Z'
      },
      'home': {
        'id': 1,
        'locationId': 1,
        'address': 'the dojo',
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2018-11-14T00:00:00.000Z'
      },
      'engagement': {
        'id': 1,
        'partnerId': 1,
        'fellowId': 1,
        'startDate': '2019-01-22',
        'endDate': '2019-05-22',
        'workHours': '13:00-22:00',
        'createdAt': '2019-01-22T00:00:00.000Z',
        'updatedAt': '2019-01-22T00:00:00.000Z',
        'partner': {
          'id': 1,
          'name': 'Partner Inc. NYC',
          'createdAt': '2019-01-22T00:00:00.000Z',
          'updatedAt': '2019-01-22T00:00:00.000Z'
        },
        'fellow': {
          'id': 1,
          'name': 'New Name',
          'slackId': 'XXXXXXXXX',
          'phoneNo': '2349782037189',
          'email': 'me.you@test.com',
          'defaultDestinationId': null,
          'createdAt': '2018-11-14T00:00:00.000Z',
          'updatedAt': '2019-02-06T15:09:04.311Z'
        }
      }
    },
    {
      'id': 2,
      'distance': null,
      'opsComment': null,
      'managerComment': null,
      'engagementId': 1,
      'managerId': 1,
      'busStopId': 1,
      'homeId': 1,
      'busStopDistance': null,
      'routeImageUrl': null,
      'status': 'Pending',
      'createdAt': '2019-02-06T15:09:21.991Z',
      'updatedAt': '2019-02-06T15:09:21.991Z',
      'manager': {
        'id': 1,
        'name': 'New Name',
        'slackId': 'XXXXXXXXX',
        'phoneNo': '2349782037189',
        'email': 'me.you@test.com',
        'defaultDestinationId': null,
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2019-02-06T15:09:04.311Z'
      },
      'busStop': {
        'id': 1,
        'locationId': 1,
        'address': 'the dojo',
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2018-11-14T00:00:00.000Z'
      },
      'home': {
        'id': 1,
        'locationId': 1,
        'address': 'the dojo',
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2018-11-14T00:00:00.000Z'
      },
      'engagement': {
        'id': 1,
        'partnerId': 1,
        'fellowId': 1,
        'startDate': '2019-01-22',
        'endDate': '2019-05-22',
        'workHours': '13:00-22:00',
        'createdAt': '2019-01-22T00:00:00.000Z',
        'updatedAt': '2019-01-22T00:00:00.000Z',
        'partner': {
          'id': 1,
          'name': 'Partner Inc. NYC',
          'createdAt': '2019-01-22T00:00:00.000Z',
          'updatedAt': '2019-01-22T00:00:00.000Z'
        },
        'fellow': {
          'id': 1,
          'name': 'New Name',
          'slackId': 'XXXXXXXXX',
          'phoneNo': '2349782037189',
          'email': 'me.you@test.com',
          'defaultDestinationId': null,
          'createdAt': '2018-11-14T00:00:00.000Z',
          'updatedAt': '2019-02-06T15:09:04.311Z'
        }
      }
    },
    {
      'id': 3,
      'distance': null,
      'opsComment': null,
      'managerComment': null,
      'engagementId': 1,
      'managerId': 1,
      'busStopId': 1,
      'homeId': 1,
      'busStopDistance': null,
      'routeImageUrl': null,
      'status': 'Pending',
      'createdAt': '2019-02-06T15:09:21.991Z',
      'updatedAt': '2019-02-06T15:09:21.991Z',
      'manager': {
        'id': 1,
        'name': 'New Name',
        'slackId': 'XXXXXXXXX',
        'phoneNo': '2349782037189',
        'email': 'me.you@test.com',
        'defaultDestinationId': null,
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2019-02-06T15:09:04.311Z'
      },
      'busStop': {
        'id': 1,
        'locationId': 1,
        'address': 'the dojo',
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2018-11-14T00:00:00.000Z'
      },
      'home': {
        'id': 1,
        'locationId': 1,
        'address': 'the dojo',
        'createdAt': '2018-11-14T00:00:00.000Z',
        'updatedAt': '2018-11-14T00:00:00.000Z'
      },
      'engagement': {
        'id': 1,
        'partnerId': 1,
        'fellowId': 1,
        'startDate': '2019-01-22',
        'endDate': '2019-05-22',
        'workHours': '13:00-22:00',
        'createdAt': '2019-01-22T00:00:00.000Z',
        'updatedAt': '2019-01-22T00:00:00.000Z',
        'partner': {
          'id': 1,
          'name': 'Partner Inc. NYC',
          'createdAt': '2019-01-22T00:00:00.000Z',
          'updatedAt': '2019-01-22T00:00:00.000Z'
        },
        'fellow': {
          'id': 1,
          'name': 'New Name',
          'slackId': 'XXXXXXXXX',
          'phoneNo': '2349782037189',
          'email': 'me.you@test.com',
          'defaultDestinationId': null,
          'createdAt': '2018-11-14T00:00:00.000Z',
          'updatedAt': '2019-02-06T15:09:04.311Z'
        }
      }
    }
  ]
};

export default getAllResponseMock;
