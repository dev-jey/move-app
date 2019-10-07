export const FellowRoutesResponseMock = {
    pageMeta: {
      totalPages: 20,
      page: 7,
      totalResults: 100,
      pageSize: 2,
    },
    data: [
      {
        'id': 1,
        'userId': 1002,
        'batchRecordId': 1,
        'userAttendStatus': 'NotConfirmed',
        'reasonForSkip': null,
        'rating': 3,
        'createdAt': '2019-04-04T10:12:02.625Z',
        'updatedAt': '2019-04-04T10:12:02.625Z',
        'user': {
            'id': 1002,
            'name': 'Mrs. Myron Stamm',
            'slackId': 'd8b6d2be-e70e-403d-b655-7fb685f64e13',
            'email': 'Reginald77@hotmail.com'
        },
        'routeUseRecord': {
            'id': 1,
            'departureDate': '2019-04-04 03:00',
            'routeId': 1005,
            'batch': {
                'batchId': 1002,
                'takeOff': '03:00',
                'status': 'Active',
                'comments': 'Similique accusantium architecto omnis repellat.'
            },
            'cabDetails': {
                'cabId': 1,
                'driverName': 'Dominic Toretto',
                'driverPhoneNo': '485-908-0558 x619',
                'regNumber': 'SMK 319 JK'
            },
            'route': {
                'routeId': 1005,
                'name': 'Doug Flats',
                'destination': {
                    'locationId': 1005,
                    'address': '0707 VonRueden Union'
                }
            }
        }
    },        {
      'id': 2,
      'userId': 1002,
      'batchRecordId': 1,
      'userAttendStatus': 'NotConfirmed',
      'reasonForSkip': null,
      'rating': 3,
      'createdAt': '2019-04-04T10:12:02.625Z',
      'updatedAt': '2019-04-04T10:12:02.625Z',
      'user': {
          'id': 1002,
          'name': 'Mrs. Myron Stamm',
          'slackId': 'd8b6d2be-e70e-403d-b655-7fb685f64e13',
          'email': 'Reginald77@hotmail.com'
      },
      'routeUseRecord': {
          'id': 1,
          'departureDate': '2019-04-04 03:00',
          'routeId': 1005,
          'batch': {
              'batchId': 1002,
              'takeOff': '03:00',
              'status': 'Active',
              'comments': 'Similique accusantium architecto omnis repellat.'
          },
          'cabDetails': {
              'cabId': 1,
              'driverName': 'Dominic Toretto',
              'driverPhoneNo': '485-908-0558 x619',
              'regNumber': 'SMK 319 JK'
          },
          'route': {
              'routeId': 1005,
              'name': 'Doug Flats',
              'destination': {
                  'locationId': 1005,
                  'address': '0707 VonRueden Union'
              }
          }
      }
  },        {
    'id': 3,
    'userId': 1002,
    'batchRecordId': 1,
    'userAttendStatus': 'NotConfirmed',
    'reasonForSkip': null,
    'rating': 3,
    'createdAt': '2019-04-04T10:12:02.625Z',
    'updatedAt': '2019-04-04T10:12:02.625Z',
    'user': {
        'id': 1002,
        'name': 'Mrs. Myron Stamm',
        'slackId': 'd8b6d2be-e70e-403d-b655-7fb685f64e13',
        'email': 'Reginald77@hotmail.com'
    },
    'routeUseRecord': {
        'id': 1,
        'departureDate': '2019-04-04 03:00',
        'routeId': 1005,
        'batch': {
            'batchId': 1002,
            'takeOff': '03:00',
            'status': 'Active',
            'comments': 'Similique accusantium architecto omnis repellat.'
        },
        'cabDetails': {
            'cabId': 1,
            'driverName': 'Dominic Toretto',
            'driverPhoneNo': '485-908-0558 x619',
            'regNumber': 'SMK 319 JK'
        },
        'route': {
            'routeId': 1005,
            'name': 'Doug Flats',
            'destination': {
                'locationId': 1005,
                'address': '0707 VonRueden Union'
            }
        }
    }
},
    ]
};

export const FellowProcessedDataMock = {
    data: [
        {
            'address': '0707 VonRueden Union',
            'departureDate': '2019-04-04 03:00',
            'driverName': 'Dominic Toretto',
            'name': 'Doug Flats',
            'rating': 3,
            'regNumber': 'SMK 319 JK',
            'userAttendStatus': 'NotConfirmed'
        }, {
            'address': '0707 VonRueden Union',
            'departureDate': '2019-04-04 03:00',
            'driverName': 'Dominic Toretto',
            'name': 'Doug Flats',
            'rating': 3,
            'regNumber': 'SMK 319 JK',
            'userAttendStatus': 'NotConfirmed'
        }, {
            'address': '0707 VonRueden Union',
            'departureDate': '2019-04-04 03:00',
            'driverName': 'Dominic Toretto',
            'name': 'Doug Flats',
            'rating': 3,
            'regNumber': 'SMK 319 JK',
            'userAttendStatus': 'NotConfirmed'
        }
    ]
};

export const FellowErrorDataMock = {
    data: {
            'error': 'this is not an array'
        },
    pageMeta: {
        totalPages: 0,
        page: 1,
        totalResults: 0,
        pageSize: 1,
    }
};

