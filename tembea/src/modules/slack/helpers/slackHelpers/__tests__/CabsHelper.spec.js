import CabsHelper from '../CabsHelper';


describe('ManagerActionsHelper', () => {
  const cabMock = {
    model: 'subaru',
    regNumber: 'FHD - 484',
    capacity: 8,
    driverName: 'ade',
    driverPhoneNo: '94840383038',
  };
  const cabsMock = [
    cabMock
  ];

  it('it should generate a label for a cab', (done) => {
    const labelFormat = CabsHelper.generateCabLabel(cabMock);
    const expectedFormat = `${cabMock.model.toUpperCase()} - ${cabMock.regNumber} - Seats up to ${cabMock.capacity} people`;
    expect(labelFormat).toEqual(expectedFormat);
    done();
  });

  it('it should convert an array of cab details into cab lable value pairs', (done) => {
    const valuePairsData = CabsHelper.toCabLabelValuePairs(cabsMock);
    const expectedData = [
      {
        label: `${cabMock.model.toUpperCase()} - ${cabMock.regNumber} - Seats up to ${cabMock.capacity} people`,
        value: [cabMock.capacity, cabMock.model, cabMock.regNumber].toString()
      }
    ];
    expect(valuePairsData).toEqual(expectedData);
    done();
  });
});
