const getCabsResponseMock = {
    pageMeta: {
      totalPages: 20,
      page: 7,
      totalItems: 100,
      pageSize: 2,
    },
    data: [
      {
        id: 1,
        capacity: 8,
        driverName: 'Ludvdvdvbs',
        driverPhoneNo: '692.7444499.6133',
        regNumber: 'APP 519 DT',
        location: 'LOCATION'
      },
      {
        id: 2,
        capacity: 8,
        driverName: 'Luke Hobcdvdvbs',
        driverPhoneNo: '69552.799.6133',
        regNumber: 'APPscs5 519 DT',
        location: 'LOCATION'
      },
      {
        id: 3,
        capacity: 6,
        driverName: 'Hobbs',
        driverPhoneNo: '692.799.61553',
        regNumber: 'APscscP 519 DTttt',
        location: 'LOCATION'
        },
        {
          id: 4,
          capacity: 8,
          driverName: 'Le Hodvdvbbs',
          driverPhoneNo: '692.7959.6133',
          regNumber: 'APscsc5P 519 DT',
          location: 'LOCATION'
        },
        {
          id: 5,
          capacity: 8,
          driverName: 'Lukbs',
          driverPhoneNo: '692688133',
          regNumber: 'AP1scscdvdv9 DT',
          location: 'LOCATION'
        }
    ]
};
export const data = {
  data: {
    data:
      [
        {
          id: 1,
          regNumber: 'SMK 319 JK',
          capacity: '4',
          model: 'subaru',
          providerId: 1
        }
      ],
    pageMeta: {
      itemsPerPage: 20,
      pageNo: 1,
      totalItems: 12,
      totalPages: 1
    },
  },
  message: '1 of 1 page(s).',
  success: true,
};

export default getCabsResponseMock;
