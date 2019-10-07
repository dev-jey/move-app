import getCabsResponseMock from '../admin/cabs/cab-inventory/__mocks__/get-routes-response.mock';

const getDriversResponseMock = {
  pageMeta: {
    totalPages: 20,
    page: 7,
    totalResults: 100,
    pageSize: 2,
  },
  drivers: [
    {
      id: 1,
      driverName: 'James Savali',
      driverNumber: '254234',
      driverPhoneNo: '708989098',
      email: 'savali@gmail.com',
      providerId: 1
    },
    {
      id: 2,
      driverName: 'John Wayodi',
      driverNumber: '254235',
      driverPhoneNo: '708989099',
      email: 'wayodi@gmail.com',
      providerId: 1
    },
    {
      id: 3,
      driverName: 'Allan Mogusu',
      driverNumber: '254236',
      driverPhoneNo: '708989070',
      email: 'allan@gmail.com',
      providerId: 1
    },
    {
      id: 4,
      driverName: 'Meshack Ogeto',
      driverNumber: '254232',
      driverPhoneNo: '708989080',
      email: 'sharkdevs@gmail.com',
      providerId: 1
    },
    {
      id: 5,
      driverName: 'Deo Muhwezi',
      driverNumber: '254244',
      driverPhoneNo: '708989065',
      email: 'deo@gmail.com',
      providerId: 1
    }
  ]
};

export default getDriversResponseMock;
