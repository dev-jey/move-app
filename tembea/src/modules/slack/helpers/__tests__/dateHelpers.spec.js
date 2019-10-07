import moment from 'moment-timezone';
import { getSlackDateTime, getSlackDateString } from '../dateHelpers';

describe('dateHelpers', () => {
  const testDate = new Date(2020, 6, 22, 16, 42);
  const fallback = moment(testDate).format('ddd, MMM Do YYYY hh:mm a');
  let result;

  describe('getSlackDateTime', () => {
    it('should return date with fallback value', () => {
      result = getSlackDateTime(testDate);
      expect(result.original).toEqual(testDate.getTime() / 1000);
      expect(result.fallback).toEqual(moment(testDate).format('ddd, MMM Do YYYY hh:mm a'));
    });
  });

  describe('getSlackDateString', () => {
    beforeAll(() => {
      result = getSlackDateString(testDate);
    });

    it('should return expected string', () => {
      expect(result.endsWith(`${fallback}>`)).toBeTruthy();
    });

    it('should contain 2020 before at', () => {
      expect(result.indexOf('2020 at')).toBeGreaterThan(0);
    });
  });
});
