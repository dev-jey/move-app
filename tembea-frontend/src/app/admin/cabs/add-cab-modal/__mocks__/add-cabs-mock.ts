import { CabModel } from 'src/app/shared/models/cab-inventory.model';

export const responseMock = {
  success: true,
  message: 'You have successfully created a cab',
  cab: {
    id: 30,
    driverName: 'Ahmed',
    driverPhoneNo: '09046785378',
    regNumber: 'FKJ-47',
    capacity: '7',
    model: 'Lamborghini Aventador S LP 740-4 Roadster',
    location: 'Lagos',
    updatedAt: '2019-04-14T10:22:01.291Z',
    createdAt: '2019-04-14T10:22:01.291Z'
  }
};

export const createCabMock = {
  driverName: 'Ahmed',
  driverPhoneNo: '09046785378',
  regNumber: 'FKJ-47',
  capacity: '7',
  model: 'Lamborghini Aventador S LP 740-4 Roadster',
  location: 'Lagos',
};

export const getCabsMock = {
  pageMeta: {
    totalPages: 2,
    page: 1,
    totalResults: 4,
    pageSize: 2
  },
  cabs: [
    {
      driverName: 'Dominic Toretto',
      driverPhoneNo: '1-287-064-9116 x185',
      regNumber: 'SMK 319 JK',
      capacity: 4,
      model: 'subaru',
      location: 'Lagos'
    },
    {
      driverName: 'Dominic Toretto',
      driverPhoneNo: '1-287-064-9116 x185',
      regNumber: 'SMK 319 JK',
      capacity: 4,
      model: 'subaru',
      location: 'Lagos'
    },
    {
      driverName: 'Dominic Toretto',
      driverPhoneNo: '1-287-064-9116 x185',
      regNumber: 'SMK 319 JK',
      capacity: 4,
      model: 'subaru',
      location: 'Lagos'
    },
    {
      driverName: 'Dominic Toretto',
      driverPhoneNo: '1-287-064-9116 x185',
      regNumber: 'SMK 319 JK',
      capacity: 4,
      model: 'subaru',
      location: 'Lagos'
    }
  ]
};

export const updateCabMock = new CabModel(1, 'SMK 319 JE', 4, 'subaru', 1);

export const updateResponse = {
  success: true,
  message: 'Cab details updated successfully',
  data: {
    id: 1,
    regNumber: 'SMK 319 JE',
    capacity: '4',
    model: 'subaru',
    deletedAt: null,
    providerId: 1
  }
};

export class MockError extends Error {
  error: any;
  constructor(public status: number, public message: string) {
    super(message);
    this.error = {
        message
    };
  }
}
