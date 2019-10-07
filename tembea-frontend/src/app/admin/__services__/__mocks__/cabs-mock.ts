const getCabsResponseMock = {
    pageMeta: {
        totalPages: 14,
        page: '2',
        totalResults: 27,
        pageSize: 2
    },
    cabs: [
        {
            id: 4,
            driverName: 'Luke Hobbs',
            driverPhoneNo: '479.925.8907',
            regNumber: 'APP 519 DT',
            capacity: '4',
            model: 'prado',
            location: 'Nairobi',
            deletedAt: null
        },
        {
            id: 5,
            driverName: 'Arlean Bogardus',
            driverPhoneNo: '706-953-2924',
            regNumber: 'SMI 319 JK',
            capacity: '4',
            model: 'subaru',
            location: 'Lagos',
            deletedAt: null
        }
    ]
};

export default getCabsResponseMock;
