export const responseMock = {
    success: true,
    message: 'Department created successfully',
    department: {
        createdAt: '2019-03-13T07:06:00.340Z',
        headId: 15,
        id: 34,
        location: 'Nairobi',
        name: 'New',
        status: 'Active',
        teamId: 'TE2K8PGF8',
        updatedAt: '2019-03-13T07:06:00.340Z'
    }
};

export const payloadMock = {
    email: 'allan.imire@andela.com',
    location: 'Nairobi',
    name: 'HOD98'
};

export class MockError extends Error {
    error: any;
    constructor(public status: number, public message:  string) {
        super(message);
        this.error = {
            message
        };
    }
}
