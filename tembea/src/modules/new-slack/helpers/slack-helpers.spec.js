import NewSlackHelpers from './slack-helpers';

describe('slackHelpers', () => {
  describe('toSlackDropdown', () => {
    it('should convert any array to an array with text and value fields', () => {
      const data = [{ text: 'Hello', value: 1 }, { text: 'World', value: 2 }];

      const result = NewSlackHelpers.toSlackDropdown(data);
      expect(result.length).toEqual(data.length);
    });
  });
});
