import request from 'supertest';
import app from '../../../app';
import models from '../../../database/models';
import DepartmentController from '../DepartmentsController';
import HttpError from '../../../helpers/errorHandler';
import Utils from '../../../utils';

let validToken;

const { Department } = models;

beforeAll(() => {
  validToken = Utils.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
});

describe('Delete department record', () => {
  beforeAll(async () => {
    await Department.bulkCreate([{
      name: 'Test Department 1',
      headId: 1,
      teamId: 'TEAMID2'
    },
    {
      name: 'Test Department 2',
      headId: 2,
      teamId: 'TEAMID3'
    }]);
  });

  it('should return a 404 if department is not found', (done) => {
    request(app)
      .delete('/api/v1/departments')
      .send({
        name: 'No Department',
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        404,
        {
          success: false,
          message: 'Department not found'
        },
        done
      );
  });

  it('should return a 400 if incomplete data is sent', (done) => {
    request(app)
      .delete('/api/v1/departments')
      .send({})
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        400,
        {
          success: false,
          message: 'Kindly provide one of the two; id or name'
        },
        done
      );
  });

  it('should return a 400 if both params are sent', (done) => {
    request(app)
      .delete('/api/v1/departments')
      .send({
        id: 2,
        name: 'Some name'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        400,
        {
          success: false,
          message: 'Kindly provide one of the two; id or name'
        },
        done
      );
  });

  it('should return a 400 if invalid data is sent', (done) => {
    request(app)
      .delete('/api/v1/departments')
      .send({
        id: -2
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        400,
        {
          success: false,
          message: 'Id can contain only positive integers'
        },
        done
      );
  });

  it('should return a 400 if invalid data is sent', (done) => {
    request(app)
      .delete('/api/v1/departments')
      .send({
        name: '=some@funny%name'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        400,
        {
          success: false,
          message: 'Name can contain only letters dashes and spaces'
        },
        done
      );
  });

  it('should delete the department', (done) => {
    request(app)
      .delete('/api/v1/departments')
      .send({
        name: 'Test Department 1'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        200,
        {
          success: true,
          message: 'The department has been deleted'
        },
        done
      );
  });

  it('should fail which some unforseen data', (done) => {
    HttpError.sendErrorResponse = jest.fn(() => {});
    DepartmentController.deleteRecord('no', 'no');
    expect(HttpError.sendErrorResponse).toHaveBeenCalledTimes(1);
    done();
  });

  afterAll(async () => {
    const department = await Department.findOne({
      where: {
        name: 'Test Department 1'
      }
    });

    await department.destroy();
  });
});
