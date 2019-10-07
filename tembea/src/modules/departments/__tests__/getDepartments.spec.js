import request from 'supertest';
import app from '../../../app';
import Utils from '../../../utils';

let validToken;

beforeAll(() => {
  validToken = Utils.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
});

describe('Get department records', () => {
  it('should fail when page does not exist', (done) => {
    request(app)
      .get('/api/v1/departments?page=1000000000000')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(404, {
        success: false,
        message: 'There are no records on this page.'
      },
      done);
  });

  it('should paginate the departments record', (done) => {
    request(app)
      .get('/api/v1/departments?page=3&size=2')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        200,
        done
      );
  });

  it('should return the first page of departments', (done) => {
    request(app)
      .get('/api/v1/departments')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        200,
        done
      );
  });

  it('should fail when invalid query params are used', (done) => {
    request(app)
      .get('/api/v1/departments?page=gh&size=ds')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        400,
        {
          success: false,
          message: 'Please provide a positive integer value'
        },
        done
      );
  });
});
