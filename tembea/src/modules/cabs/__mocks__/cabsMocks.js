const payload = {
  regNumber: 'KCA 545',
  capacity: '1',
  model: 'Limo',
  providerId: 3,
};

const cabs = {
  data: [
    {
      id: 3,
      regNumber: 'IKR 409 KI',
      capacity: '8',
      model: 'toyota',
      providerId: 3
    },
  ],
  pageMeta: {
    totalPages: 1, pageNo: 1, totalItems: 5, itemsPerPage: 100
  }
};

const paginatedData = {
  pageMeta: {
    totalPages: 1,
    page: 1,
    totalResults: 26,
    pageSize: 100
  },
  cabs: [
    {
      id: 1,
      regNumber: 'SMK 319 JK',
      capacity: '4',
      model: 'subaru',
      providerId: 1,
      deletedAt: null
    }]
};

const overloadPayload = {
  regNumber: 'KCA 453',
  capacity: '5',
  model: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    + 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,'
    + 'when an unknown printer took a galley of type and scrambled it to make a type'
    + 'specimen book. It has survived not',
  providerId: 3
};

const returnedData = {
  data: [
    {
      id: 3,
      regNumber: 'IKR 409 KI',
      capacity: '8',
      model: 'toyota',
      providerId: 3
    },
  ],
  pageMeta: {
    totalPages: 1, pageNo: 1, totalItems: 5, itemsPerPage: 100
  }
};


const updateData = {
  regNumber: 'KCX 505',
  model: 'motor',
  capacity: 4,
  providerId: 3
};

const updateDatamock = {
  regNumber: 'KCX 505 KG',
  model: 'motor',
  capacity: 4,
  providerId: 3
};

const successMessage = '1 of 1 page(s).';
const payloadData = {
  payload,
  overloadPayload,
  updateData,
  updateDatamock,
  cabs,
  paginatedData,
  successMessage,
  returnedData
};

export default payloadData;
