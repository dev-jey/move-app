module.exports = {
  up: queryInterface => queryInterface.bulkInsert('TripRequests', [
    {
      name: 'my trip home',
      riderId: 1,
      departureTime: new Date('November 16 2018 12:30'),
      originId: 1,
      destinationId: 2,
      requestedById: 1,
      createdAt: '2018-11-14',
      updatedAt: '2018-11-14'
    },
    {
      name: 'my trip to the dojo',
      riderId: 2,
      departureTime: new Date('November 16 2018 12:30'),
      originId: 1,
      destinationId: 2,
      requestedById: 1,
      createdAt: '2018-11-14',
      updatedAt: '2018-11-14'
    }
  ]),
  down: queryInterface => queryInterface.bulkDelete('TripRequests')
};
