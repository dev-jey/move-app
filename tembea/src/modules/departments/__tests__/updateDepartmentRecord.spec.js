import request from 'supertest';
import app from '../../../app';
import Utils from '../../../utils';

let validToken;

beforeAll(() => {
  validToken = Utils.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
});

describe('/Departments update', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a department not found error with wrong department name', (done) => {
    request(app)
      .put('/api/v1/departments')
      .send({
        name: 'NoDepartment',
        newName: 'newDepartmentName'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(404, {
        success: false,
        message: 'Department not found. To add a new department use POST /api/v1/departments'
      }, done);
  });

  it('should return a user not found when the email does not exist in the database', (done) => {
    request(app)
      .put('/api/v1/departments')
      .send({
        name: 'TDD',
        newHeadEmail: 'unknownuser254@gmail.com'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(404, {
        success: false,
        message: 'User not found'
      }, done);
  });

  it('should return a user not found when the email does not exist in the database', (done) => {
    request(app)
      .put('/api/v1/departments')
      .send({
        name: 'TDD',
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(400, done);
  });

  it('should return a provide valid email when the email is not valid', (done) => {
    request(app)
      .put('/api/v1/departments')
      .send({
        name: 'TDD',
        newHeadEmail: 'invalidEmail'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(400, {
        success: false,
        message: 'Please provide a valid email'
      }, done);
  });

  it('should return provide value when property is defined with no value', (done) => {
    request(app)
      .put('/api/v1/departments')
      .send({
        name: 'TDD',
        newHeadEmail: ''
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(400, {
        success: false,
        message: ['Please provide a value for newHeadEmail.']
      }, done);
  });

  it('should return provide value when property is defined with no value', (done) => {
    request(app)
      .put('/api/v1/departments')
      .send({
        name: 'Finance-demo',
        newName: 'Finance-demo-update',
        newHeadEmail: 'test.buddy1@andela.com'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(200, done);
  });
});
